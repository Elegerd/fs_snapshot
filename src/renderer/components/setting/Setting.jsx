import React, {useState} from 'react';
import TimeField from 'react-simple-timefield';
import Switch from 'react-switch';
import {useSelector} from 'react-redux';
import Table from '../commonComponents/Table.jsx';
import './setting.scss';


const {myIpcRenderer} = window;

const Setting = () => {
    const {settings} = useSelector(state => state.main);
    const [customSettings, setCustomSettings] = useState(settings);
    const onSubmitSettings = () => myIpcRenderer.send('APP_SETTING', customSettings);
    const onClickSelectDirectories = async () => {
        try {
            const dirs = await myIpcRenderer.invoke('APP_SELECT_DIRECTORIES');
            setCustomSettings((prevState) => ({
                ...prevState,
                paths: dirs
            }))
        } catch (e) {
            console.error(e);
            setCustomSettings((prevState) => ({
                ...prevState,
                paths: []
            }))
        }
    };

    return (
        <>
            <h1>Setting</h1>
            {customSettings &&
            <div className={'setting'}>
                <div className={'setting__dirs'}>
                    <p>Directories to scan</p>
                    <Table objects={customSettings.paths || []}/>
                    <button onClick={onClickSelectDirectories}>
                        Select directories
                    </button>
                </div>
                <div className={'setting__scan'}>
                    <p>Automatic system scan</p>
                    <Switch
                        onColor={'#334ce7'}
                        offColor={'#919dac'}
                        activeBoxShadow={'0 0 2px 3px #4a5c7a'}
                        checked={!customSettings.disabledSchedule}
                        onChange={(value) => {
                            setCustomSettings((prevState) => ({
                                ...prevState,
                                disabledSchedule: !value
                            }))
                        }}
                    />
                </div>
                <div className={'setting__time'}>
                    <p>System scan time</p>
                    <TimeField
                        value={customSettings.schedule}
                        onChange={(event, value) => {
                            setCustomSettings((prevState) => ({
                                ...prevState,
                                schedule: value
                            }))
                        }}
                    />
                </div>
                <div>
                    <button onClick={onSubmitSettings}>
                        Submit
                    </button>
                </div>
            </div>
            }
        </>
    );
};

export default Setting