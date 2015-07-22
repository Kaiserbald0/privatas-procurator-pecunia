var React = require('react');
var Router = require('react-router');
var _ = require('underscore');
var Route = Router.Route;
var Bootstrap = require('react-bootstrap')
    ,Navbar = Bootstrap.Navbar
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Modal = Bootstrap.Modal
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = require("./components/main");

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="dashboard" path="dashboard" handler={App.bind(this,'dashboard')}/>
    <Route name="password" path="password" handler={App.bind(this,'password')}/>
    <DefaultRoute handler={App}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
