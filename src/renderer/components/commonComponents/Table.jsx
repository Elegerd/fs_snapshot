import React from 'react'
import './table.scss'

const Table = ({objects}) => {

    return (
        <table>
            {objects.map(obj => (
                <div className={'dir-table__tr'} key={obj}>
                    <div className={'dir-table__td'} title={obj}>
                        {obj}
                    </div>
                </div>
            ))}
        </table>
    );
};

export default Table;
