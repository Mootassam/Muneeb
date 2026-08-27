import "./App.css";
import { Router } from "react-router-dom";
import RoutesComponent from "src/view/shared/routes/RoutesComponent";
import { Provider } from "react-redux";
import { configureStore, getHistory } from "src/modules/store";
const store = configureStore();
function App() {
  return (
    <Provider store={store}>
    <Router history={getHistory()}>
      <RoutesComponent />
    </Router>
    </Provider>
  );
}

export default App;
