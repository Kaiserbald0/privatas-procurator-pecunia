var React = require('react');
var Router = require('react-router');
var _ = require('underscore');
var Numeral = require('numeral');
var Sha1 = require('sha1');
var Moment = require('moment');
var Route = Router.Route;
var Bootstrap = require('react-bootstrap')
    ,Navbar = Bootstrap.Navbar
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,SplitButton = Bootstrap.SplitButton
    ,Glyphicon = Bootstrap.Glyphicon
    ,Table = Bootstrap.Table
    ,Input = Bootstrap.Input
    ;
    
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var NewExpenseModal = require("./modals/add_expense");
var NewIncomeModal = require("./modals/add_income");
var NewATMModal = require("./modals/add_atm");
var NewTransferModal = require("./modals/add_transfer");
var currencyDropdown = (
  <DropdownButton title='Currency'>
    <MenuItem key='1'>£</MenuItem>
    <MenuItem key='2'>$</MenuItem>
    <MenuItem key='3'>€</MenuItem>
    <MenuItem key='4'>¥</MenuItem>
  </DropdownButton>
);

var Transactions = [];

var AccountsList = [
  'Tsb','Cach on hand', 'Investment XXX'
];

var deleteTimer;

Numeral.defaultFormat('0,0[.]00 $');

module.exports = React.createClass({
  
  openModal : function (e) {
    
    var state = {};
    
    switch (e) {
      case 'expense':
        state = {showExpenseModal:true};
      break;
      case 'income':
        state = {showIncomeModal:true};
      break;   
      case 'atm':
        state = {showATMModal:true};
      break; 
      case 'transfer':
        state = {showTransferModal:true};
      break; 
    }
    
    
    this.setState(state);
    
  },
  
  closeModal : function (e) {
    
        
    var state = {};
    
    switch (e) {
      case 'expense':
        state = {showExpenseModal:false};
      break;
      case 'income':
        state = {showIncomeModal:false};
      break;   
      case 'atm':
        state = {showATMModal:false};
      break; 
      case 'transfer':
        state = {showTransferModal:false};
      break; 
    }
    
    
    this.setState(state);
    
  }, 
  
  
  getInitialState : function () {
    /*
      0 = date
      1 = amount
      2 = account
      3 = note
    */
    
    var rawT = localStorage.getItem("Transactions");
    var T = Transactions;
    if (rawT != null) {
      T = JSON.parse(rawT);
    }
    
    return ({
      showExpenseModal : false
      , showIncomeModal : false
      , showATMModal : false
      , showTransferModal : false
      , Transactions : T
      , editCell : [-1,-1]
    });
    
  },
  
  printTransactionRow: function(Transaction) {

    //debugger;
    var i = 0;
    var edit = [false,false,false,false];
    if (Transaction[0] == this.state.editCell[0]) {
      edit[this.state.editCell[1]] = true;
    }
    
    var inputCommonProps = {
      className : "onlineEdit"
      , type : "text"
    };
    
    return (
      <tr onMouseEnter={this.onMouseEnterTr} onMouseLeave={this.onMouseLeaveTr}>
        <td onClick={this.handleDoubleClick.bind(this,Transaction[0],0)}>{Moment(Transaction[1]).format('LL')}</td>
        <td onClick={this.handleDoubleClick.bind(this,Transaction[0],1)}className={Transaction[2]}>{ edit[1] ? <Input {...inputCommonProps} defaultValue={Numeral(Transaction[3]).divide(100)}  ref="editAmmount" onKeyUp={this.SaveAmmount.bind(this,Transaction[0])} /> : Numeral(Transaction[3]).divide(100).format() }</td>
        <td onClick={this.handleDoubleClick.bind(this,Transaction[0],2)}>{ edit[2] ? <Input {...inputCommonProps} defaultValue={Transaction[4]} onKeyUp={this.SaveAccount.bind(this,Transaction[0])} ref="editAccount" /> : Transaction[4] }</td>
        <td onClick={this.handleDoubleClick.bind(this,Transaction[0],3)}>{ edit[3] ? <Input {...inputCommonProps} defaultValue={Transaction[5]} onKeyUp={this.SaveComment.bind(this,Transaction[0])} ref="editComment" /> : Transaction[5] }</td>
      </tr>
    );
  },
  
  onMouseEnterTr : function() {
    deleteTimer = setTimeout(function() {
      //alert('Beeeep')
    }, 1500);
  },
  
  onMouseLeaveTr : function() {
    clearTimeout(deleteTimer);
  },  
  
  componentDidUpdate : function () {
    //console.log(this.state.editCell[1]);
    switch (this.state.editCell[1]) {
      
      case 1:
        React.findDOMNode(this.refs.editAmmount).children[0].focus();
      break;
      
      case 2:
        React.findDOMNode(this.refs.editAccount).children[0].focus();
      break;
      
      case 3:
        React.findDOMNode(this.refs.editComment).children[0].focus();
      break;
        
    }
  },
  
  SaveAmmount : function(tr_id,e) {
    if (e.keyCode == 13) {
      this.updateTransaction(tr_id,3,parseFloat(this.refs.editAmmount.getValue())*100 );
      this.setState({editCell:[-1,-1]});
    }
    
  },
  
  SaveAccount : function(tr_id,e) {
    if (e.keyCode == 13) {
      this.updateTransaction(tr_id,4,this.refs.editAccount.getValue());
      this.setState({editCell:[-1,-1]});
    }
  },
  
  SaveComment : function(tr_id,e) {
    
    if (e.keyCode == 13) {
      this.updateTransaction(tr_id,5,this.refs.editComment.getValue());
      this.setState({editCell:[-1,-1]});
    }
  },
  
  updateTransaction : function(tr_id,field_id,value) {
    var T = this.state.Transactions;
    
    var elementPos = T.map(function(x) {
      return x[0]; 
    }).indexOf(tr_id);
    
    T[elementPos][field_id] = value;

    localStorage.setItem("Transactions",JSON.stringify(T));
  },
  
  handleDoubleClick : function(_id,what) {
    
    this.setState({editCell:[_id,what]});
    
  },
  
  getTotal: function(Transactions) {
    return Transactions.map(function(Transaction){
                  return Transaction[3];
                }).reduce(function(prevValue,currentElement){
                  return currentElement + prevValue;
                })
  },
  
  getNextId : function() {
    
    var nextId = this.state.Transactions.map(function(row){
      return row[0];
    });
    
    nextId = Math.max.apply( null, nextId);
    
    
    if (nextId < 0) return 1
      else return nextId+1
    
  },
  
  addIncome: function (data) {
  
    var T = this.state.Transactions;
    var now = new Date().getTime();
    T.push([
        this.getNextId()
        , data[1]
        , 'income'
        , parseInt(data[0])
        , data[2]
        , data[3]
      ]);
      
    localStorage.setItem("Transactions",JSON.stringify(T));
      
    this.setState({Transactions:T});    
  
  },
  
  addExpense: function (data) {

    //debugger;
    var T = this.state.Transactions;
    var now = new Date().getTime();
    T.push([
        this.getNextId()
        , data[1]
        , 'expense'
        , parseInt(data[0]*-1)
        , data[2]
        , data[3]
      ]);
      
    localStorage.setItem("Transactions",JSON.stringify(T));
      
    this.setState({Transactions:T});
  },
  
  addATM: function (data) {

    var TransactionData = [
      data[0]
      , data[1]
      , data[2]
      , data[3]
    ];
    
    this.addExpense(TransactionData);
    
    var TransactionData = [
      data[0]
      , data[1]
      , 'Cash on hand'
      , data[3]
    ];
    
    this.addIncome(TransactionData);
    
  },  
  
  addTransfer: function (data) {

    var TransactionData = [
      data[0]
      , data[1]
      , data[2]
      , data[4]
    ];
    
    this.addExpense(TransactionData);
    
    var TransactionData = [
      data[0]
      , data[1]
      , data[3]
      , data[4]
    ];
    
    this.addIncome(TransactionData);
    
  },    
  
  render: function () {
    
    var Transactions = this.state.Transactions;
    var Total = 0;
    var AccountsList = [];
    var AccountsAmmount = [];
    if (Transactions.length > 0) {
      Total = this.getTotal(Transactions);
      AccountsList = Transactions.map(function(row){
        return row[4];
      }).filter(function(item, pos, array) {
        return array.indexOf(item) == pos;
      });
      
      
      for (var t in Transactions){
        var idx = AccountsList.indexOf(Transactions[t][4]);
        var tr_value = Transactions[t][3];
        if (typeof AccountsAmmount[idx] == 'undefined')
          AccountsAmmount[idx]=tr_value;
        else
          AccountsAmmount[idx]+=tr_value;
          
      }
      
    }
   
    //debugger;
    return (
      <div>
        <header>
            <Navbar brand={<img src="img/HTML5_Badge_256.png" />} inverse >
            <Nav>
              <NavItem eventKey={1} href='#dashboard'>Dashboard</NavItem>
              <NavItem eventKey={2} href='#' onClick={this.openModal.bind(this,'expense')} >New expense</NavItem>
              <NavItem eventKey={3} href='#' onClick={this.openModal.bind(this,'income')} >New income</NavItem>
              <NavItem eventKey={4} href='#' onClick={this.openModal.bind(this,'atm')} >ATM Cashout</NavItem>
              <NavItem eventKey={5} href='#' onClick={this.openModal.bind(this,'transfer')} >Account Transfer</NavItem>
              <DropdownButton eventKey={6} title='Settings'>
                <MenuItem eventKey='1'>Action</MenuItem>
                <MenuItem eventKey='2'>Another action</MenuItem>
                <MenuItem eventKey='3'>Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey='4' href='#password'>Password</MenuItem>
              </DropdownButton>
              
              
            </Nav>
            <SplitButton className="userInfo" title={<Glyphicon glyph='user' className = 'glyph-selected' />} pullRight>
              <MenuItem eventKey={1}>Logged in as: Jason</MenuItem>
              <MenuItem eventKey={3}>Logout </MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={4}>Help Center</MenuItem>
              <MenuItem eventKey={4}>About</MenuItem>
            </SplitButton>
          </Navbar>
        </header>

        {this.state.showExpenseModal?<NewExpenseModal currencyDropdown = {currencyDropdown} callback_onclose = {this.closeModal} callback_onsave = {this.addExpense} />:null }
        {this.state.showIncomeModal?<NewIncomeModal currencyDropdown = {currencyDropdown} callback_onclose = {this.closeModal} callback_onsave = {this.addIncome} />:null }
        {this.state.showATMModal?<NewATMModal currencyDropdown = {currencyDropdown} callback_onclose = {this.closeModal} callback_onsave = {this.addATM} />:null }
        {this.state.showTransferModal?<NewTransferModal currencyDropdown = {currencyDropdown} callback_onclose = {this.closeModal} callback_onsave = {this.addTransfer} />:null }



        <Table striped bordered condensed hover width="99%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Ammount</th>
              <th>Account</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {Transactions.sort(function(a,b){
              var key1 = new Date(a[1]);
              var key2 = new Date(b[1]);
              if (key1 < key2) {
                return -1;
              } else if (key1 == key2) {
                return -1;
              } else {
                if (a[0] > a[1]) return 1;
                else return 0;
              }
            }).map(this.printTransactionRow)}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th className={Total>0?'income':'expense'}>{Numeral(Total).divide(100).format()}</th>
              
            </tr>
          </tfoot>
        </Table>
          
        
         <Table striped bordered condensed hover width="99%">
          <thead>
            <tr>
            {AccountsList.map(function(row){
              return <td>{row}</td>
              })
            }
            </tr>
            
          </thead>
          <tbody>
          <tr>
            {AccountsAmmount.map(function(row){
              return <td>{Numeral(row).divide(100).format()}</td>
              })
            }
          </tr>
        </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th className={Total>0?'income':'expense'}>{Numeral(Total).divide(100).format() }</th>
              
            </tr>
          </tfoot>
        </Table>
        
      </div>
    );
  }
});

