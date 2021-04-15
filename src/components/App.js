import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Auth/PrivateRoute";

// Import routes
import Signup from "./Auth/Signup";
import Home from "./Home";
import Login from "./Auth/Login";
import ForgotPassword from "./Auth/ForgotPassword";
import "../stylesheets/App.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import LandingHome from "./Landing/LandingHome";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route path="/landing" component={LandingHome}/>
              <PrivateRoute path="/courses" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
