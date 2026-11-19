import { AppRegistry } from 'react-native';
import { MovieList } from '@tv/shared-ui';
import { name } from './app.json';
import { useKeplerBackHandler } from '@amazon-devices/react-native-kepler';
function App() {
  const backHandler = useKeplerBackHandler();
  return <MovieList backHandler={backHandler} />;
}
AppRegistry.registerComponent(name, () => App);
