import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { i18n } from 'src/i18n';
import comboSelectors from 'src/modules/combo/comboSelectors';
import destroyActions from 'src/modules/combo/destroy/comboDestroyActions';
import destroySelectors from 'src/modules/combo/destroy/comboDestroySelectors';
import actions from 'src/modules/combo/list/comboListActions';
import selectors from 'src/modules/combo/list/comboListSelectors';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import ButtonIcon from 'src/view/shared/ButtonIcon';
import Toolbar from 'src/view/shared/styles/Toolbar';
import ReactTooltip from 'react-tooltip';
import { getHistory } from 'src/modules/store';

function ComboListToolbar(props) {
  const [destroyAllConfirmVisible, setDestroyAllConfirmVisible] =
    useState(false);

  const dispatch = useDispatch();

  const selectedKeys = useSelector(selectors.selectSelectedKeys);
  const loading = useSelector(selectors.selectLoading);
  const destroyLoading = useSelector(destroySelectors.selectLoading);
  const hasPermissionToDestroy = useSelector(
    comboSelectors.selectPermissionToDestroy,
  );
  const hasPermissionToCreate = useSelector(
    comboSelectors.selectPermissionToCreate,
  );

  const doOpenDestroyAllConfirmModal = () => {
    setDestroyAllConfirmVisible(true);
  };

  const doCloseDestroyAllConfirmModal = () => {
    setDestroyAllConfirmVisible(false);
  };

  const doDestroyAllSelected = () => {
    doCloseDestroyAllConfirmModal();

    dispatch(destroyActions.doDestroyAll(selectedKeys));
  };

  const renderDestroyButton = () => {
    if (!hasPermissionToDestroy) {
      return null;
    }

    const disabled = !selectedKeys.length || loading;

    const button = (
      <button
        disabled={disabled}
        className="btn btn-primary"
        type="button"
        onClick={doOpenDestroyAllConfirmModal}
      >
        <ButtonIcon
          loading={destroyLoading}
          iconClass="far fa-trash-alt"
        />
      </button>
    );

    if (disabled) {
      return (
        <span
          data-tip={i18n('common.mustSelectARow')}
          data-tip-disable={!disabled}
          data-for="combo-list-toolbar-destroy-tooltip"
        >
          {button}
          <ReactTooltip id="combo-list-toolbar-destroy-tooltip" />
        </span>
      );
    }

    return button;
  };

  return (
    <Toolbar>
      {hasPermissionToCreate && (
        <span
          data-tip={i18n('common.new')}
          data-for="combo-list-toolbar-new-tooltip"
        >
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => getHistory().push('/combo/new')}
          >
            <ButtonIcon iconClass="fas fa-plus" />
          </button>
          <ReactTooltip id="combo-list-toolbar-new-tooltip" />
        </span>
      )}

      {renderDestroyButton()}

      {destroyAllConfirmVisible && (
        <ConfirmModal
          title={i18n('common.areYouSure')}
          onConfirm={() => doDestroyAllSelected()}
          onClose={() => doCloseDestroyAllConfirmModal()}
          okText={i18n('common.yes')}
          cancelText={i18n('common.no')}
        />
      )}
    </Toolbar>
  );
}

export default ComboListToolbar;
