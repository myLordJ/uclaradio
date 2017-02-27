// Panel.jsx
// Secret DJ Panel

import React from 'react';
import ReactDOM from 'react-dom';
// React-Router
import { Router, Route, IndexRoute, browserHistory, Link, IndexLink } from 'react-router';

// Panel Containers (View Controllers)
import PanelFAQPage from './panel/panelFAQ.jsx';
import PanelManagerPage from './panel/panelManager.jsx';
import PanelShowPage from './panel/panelShow.jsx';
import PanelDJPage from './panel/panelDJ.jsx';
import PanelEventsPage from './panel/components/panelEvents.jsx';

// Panel Elements
var PanelLinksNavbar = require('./panel/PanelLinksNavbar.jsx');

import Error404Page from './frontpage/components/Error404Page.jsx';

var managerUrls = {
  managerInfo: "/panel/manager/api/info",
  managerUpdate: "/panel/manager/api/update",
  allShows: "/panel/api/allshows",
  showLink: "/panel/show",
  listAccounts: "/panel/manager/api/listAccounts",
  verifyAccount: "/panel/manager/api/verify",
  delete: "/panel/manager/api/delete",
  deleteUnverified: "/panel/manager/api/deleteUnverified",
  getReportedMessages: "/chat/reportedMessages",
  deleteMessages: "/panel/manager/api/deletechat",
  keepMessages: "/panel/manager/api/freechat"
};

var FAQurls = {
  url: "/panel/api/faq"
};

var DJurls = {
  url: "/panel/api/user",
  picURL: "/panel/api/userPic",
  showsURL: "/panel/api/usershows",
  showLink: "/panel/show",
  addShowURL: "/panel/api/addShow"
};

const PanelContent = React.createClass({
  render: function() {
    var showPlaying = this.props.nowPlaying && this.props.nowPlaying.title != null;
    return (
      <div>
          <PanelLinksNavbar/>
          { this.props.children }
      </div>
    )
  }
});

const Panel = React.createClass({
  render: function() {
    return (
      <Router history={browserHistory}>
        <Route path="/panel" component={props => <PanelContent {...this.props} {...props} />}>
          <IndexRoute component={() => <PanelDJPage urls={DJurls}/>} />
          <Route path="/panel/home" component={() => <PanelDJPage urls={DJurls}/>} />
          <Route path="/panel/faq" component={() => <PanelFAQPage urls={FAQurls}/>} />
          <Route path="/panel/manager" component={() => <PanelManagerPage urls={managerUrls}/>} />
          <Route path="/panel/events" component={PanelEventsPage} />
          <Route path="*" component={Error404Page} />
        </Route>
      </Router>
    );
  }
});

// display app
ReactDOM.render((
  <Panel />
), document.getElementById('content'));

export default Panel;