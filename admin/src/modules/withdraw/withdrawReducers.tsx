import list from 'src/modules/withdraw/list/withdrawListReducers';
import form from 'src/modules/withdraw/form/withdrawFormReducers';
import view from 'src/modules/withdraw/view/withdrawViewReducers';
import destroy from 'src/modules/withdraw/destroy/withdrawDestroyReducers';
import importerReducer from 'src/modules/withdraw/importer/withdrawImporterReducers';
import count from 'src/modules/withdraw/count/withdrawCountReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  view,
  destroy,
  importer: importerReducer,
  count,
});
