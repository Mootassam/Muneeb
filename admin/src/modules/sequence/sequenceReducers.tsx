import list from 'src/modules/sequence/list/sequenceListReducers';
import form from 'src/modules/sequence/form/sequenceFormReducers';
import destroy from 'src/modules/sequence/destroy/sequenceDestroyReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
  destroy,
});
