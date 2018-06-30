import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';

export default () => configure({ adapter: new Adapter() });