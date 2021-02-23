import Parse from 'parse';
import { environment } from './environment';
import WebEditor from './WebEditor';
import 'bootstrap/dist/css/bootstrap.min.css';

Parse.initialize(environment.APPLICATION_ID, environment.JAVASCRIPT_KEY);
Parse.serverURL = environment.SERVER_URL;
Parse.liveQueryServerURL = environment.liveQueryServerURL;

function EditorTest() {
  return (
    <div className="container">
      <div className="display-4 text-secondary mb-4">Autographa Web Editor</div>
      <WebEditor />
    </div>
  );
}

export default EditorTest;
