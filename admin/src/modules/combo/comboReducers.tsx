import list from 'src/modules/combo/list/comboListReducers';
import destroy from 'src/modules/combo/destroy/comboDestroyReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  destroy,
});
