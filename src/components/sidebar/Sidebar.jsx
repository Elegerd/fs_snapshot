import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectNavId } from '../../actions/navItemActions.js'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Icon from '@material-ui/core/Icon'
import './sidebar.scss'


const Sidebar = () => {
  const dispatch = useDispatch();
  const { selectedNavId, navItems } = useSelector(state => state.nav);

  const onClickLink = id => dispatch(selectNavId(id));

  const renderNavBlock = (items) => {
    const renderNavBlockChildren = (children) =>
      children.map(child => (
        <Link
          key={child.title}
          to={`/${child.path}`}
          onClick={_ => onClickLink(child.id)}
          className={classNames({
            'nav-item': child.id !== selectedNavId,
            'nav-item--active': child.id === selectedNavId
          })}
        >
            <Icon className={'nav-item__icon'}> {child.icon} </Icon>
            <div className={'nav-item__title'}> {child.title} </div>
        </Link>
      ));

    return items.map(item => (
      <div key={item.id} className={'main-nav__nav-block'}>
        <div className={'nav-block__title'}> {item.title} </div>
        {renderNavBlockChildren(item.children)}
      </div>
    ));
  };

  return (
    <nav role="navigation">
      <div className={'main-header'}> FS Snapshot </div>
      <div className={"main-nav"}>
        {renderNavBlock(navItems)}
      </div>
    </nav>
  );
};

export default Sidebar;
