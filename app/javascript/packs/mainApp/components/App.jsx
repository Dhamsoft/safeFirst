import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Landing from './Landing';
import Incidents from './Incidents';
import Hsmeeting from './Hsmeeting';
import DailyMeeting from './DailyMeeting';
import Sites from './Sites';
import Nav from './Nav';
import SafetyMeetContainer from './SafetyMeetContainer';

// TODO: redirect to /# if logged in user tries to go to register/login endpoints
// TODO: redirect to /#/login if logged out user tries to go to authenticated endpoints
class App extends React.Component {
  constructor(props) {
    super(props)
  }

  // TODO: fetch user's name if logged in (endpoint currently missing)
  // componentWillMount() {
  //   const { userName, isAuthenticated } = this.props;
  //
  //   // call get endpoint if loggedIn and no username
  //   if (isAuthenticated && userName.length === 0) {
  //     this.props.fetchUsername();
  //   }
  // }

  // When logged in, all the following routes depending on if a site is set
  authenticatedComponent() {
     const { currentSite } = this.props;

    return !!currentSite ? [
      <Route key="0" exact path="/" component={ Dashboard }/>,
      <Route key="1" path="/incidents" component={ Incidents }/>,
      <Route key="2" path="/hsmeeting" component={ Hsmeeting }/>,
      <Route key="3" path="/hsmeetinglist" component={ SafetyMeetContainer }/>,
      <Route key="4" path="/dailymeeting" component={ DailyMeeting }/>,
      <Route key="5" path="/sites" component={ Sites }/>
    ] : [<Route key="5" path="/sites" component={ Sites }/>]
  }

  // When NOT logged in, all the following routes
  static nonauthenticatedComponent() {
    return [
      <Route key="0" exact path="/" component={ Landing }/>,
      <Route key="1" path="/login" component={ Login }/>,
      <Route key="2" path="/register" component={ Register }/>
    ]
  }

  render() {
    const { isAuthenticated, isCoverPage } = this.props;

    return (
      <Router>
        <div id={ (isCoverPage && !isAuthenticated) ? 'full-cover' : '' }>
          <Nav/>
          <div className="container is-fluid">
            { isAuthenticated ? this.authenticatedComponent() : App.nonauthenticatedComponent() }
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = ({ auth, sites }) => {
  return {
    isAuthenticated: auth.isAuthenticated,
    isCoverPage: auth.isCoverPage,
    currentSite: sites.current
  }
};

export default connect(mapStateToProps)(App);
