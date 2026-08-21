import React, { useLayoutEffect, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import authSelectors from 'src/modules/auth/authSelectors';
import PermissionChecker from 'src/modules/auth/permissionChecker';
import actions from 'src/modules/layout/layoutActions';
import layoutSelectors from 'src/modules/layout/layoutSelectors';
import MenuWrapper from 'src/view/layout/styles/MenuWrapper';
import menus from 'src/view/menus';
import selectors from 'src/modules/auth/authSelectors';
import depositCountActions from 'src/modules/deposit/count/depositCountActions';
import depositCountSelectors from 'src/modules/deposit/count/depositCountSelectors';
import withdrawCountActions from 'src/modules/withdraw/count/withdrawCountActions';
import withdrawCountSelectors from 'src/modules/withdraw/count/withdrawCountSelectors';

function Menu(props) {
  const dispatch = useDispatch();

  const logoUrl = useSelector(selectors.selectLogoUrl);

  const currentTenant = useSelector(
    authSelectors.selectCurrentTenant,
  );
  const currentUser = useSelector(
    authSelectors.selectCurrentUser,
  );
  const menuVisible = useSelector(
    layoutSelectors.selectMenuVisible,
  );

  const depositPendingCount = useSelector(
    depositCountSelectors.selectPendingCount,
  );
  const withdrawPendingCount = useSelector(
    withdrawCountSelectors.selectPendingCount,
  );

  const pendingCountsByKey = {
    deposit: depositPendingCount,
    withdraw: withdrawPendingCount,
  };

  useEffect(() => {
    if (!currentTenant || !currentUser) {
      return;
    }

    dispatch(depositCountActions.doFetchPendingCount());
    dispatch(withdrawCountActions.doFetchPendingCount());
  }, [dispatch, currentTenant, currentUser]);

  const permissionChecker = new PermissionChecker(
    currentTenant,
    currentUser,
  );

  useLayoutEffect(() => {
    const toggleMenuOnResize = () => {
      window.innerWidth < 576
        ? dispatch(actions.doHideMenu())
        : dispatch(actions.doShowMenu());
    };

    toggleMenuOnResize();

    window.addEventListener('resize', toggleMenuOnResize);

    return () => {
      window.removeEventListener(
        'resize',
        toggleMenuOnResize,
      );
    };
  }, [dispatch]);

  const selectedKeys = () => {
    const url = props.url;
    var token = url.split('/').slice(0, 2),
      res = token.join('/');
    return res;
  };
  const match = (permission) => {
    return permissionChecker.match(permission);
  };

  const lockedForCurrentPlan = (permission) => {
    return permissionChecker.lockedForCurrentPlan(
      permission,
    );
  };

  return (
    <MenuWrapper
      style={{
        display: menuVisible ? 'block' : 'none',
      }}
    >
      <div className="menu-nav border-right">
        <div className="menu-logo">
          <Link to="/">
            {logoUrl ? (
              <img
                src={logoUrl}
                width="164px"
                alt={i18n('app.title')}
                style={{ verticalAlign: 'middle' }}
              />
            ) : (
              <>{i18n('app.title')}</>
            )}
          </Link>
        </div>
        <ul className="menu-ul">
          {menus
            .filter((menu) =>
              match(menu.permissionRequired),
            )
            .map((menu, index) => {
              const pendingCount = menu.countKey
                ? pendingCountsByKey[menu.countKey]
                : undefined;

              return (
                <li
                  key={index + 'item'}
                  className={menu.className}
                >
                  <Link to={menu.path} key={index}>
                    <i className={`${menu.icon}`}></i>
                    <span>{menu.label}</span>
                    {pendingCount !== undefined && (
                      <span
                        className={`menu-count-badge ${
                          pendingCount > 0
                            ? 'menu-count-badge--active'
                            : ''
                        }`}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

          {menus
            .filter((menu) =>
              lockedForCurrentPlan(menu.permissionRequired),
            )
            .map((menu, index) => (
              <li
                key={index}
                className={`menu-li text-nowrap`}
                style={{
                  cursor: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: 0.5,
                }}
              >
                <div className="menu-li-locked">
                  <i
                    className={`menu-icon ${menu.icon}`}
                  ></i>
                  <span>{menu.label}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </MenuWrapper>
  );
}

export default Menu;
