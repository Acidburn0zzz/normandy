import React from 'react';
import Header from './Header.jsx';
import Notifications from './Notifications.jsx';

export default function ControlApp() {
  return (
    <div>
      <Notifications />
      <Header
        pageType={this.props.children.props.route}
        currentLocation={this.props.location.pathname}
        routes={this.props.routes}
        params={this.props.params}
      />
      <div id="content" className="wrapper">
        {
          React.Children.map(this.props.children, child => React.cloneElement(child))
        }
      </div>
    </div>
  );
}
