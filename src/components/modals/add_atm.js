var React = require('react');
var _ = require('underscore');
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
var moment = require('moment');
var Moment = require('moment');
var Numeral = require('numeral');
var DatePicker = require('react-datepicker');



Numeral.defaultFormat('0,0[.]00');

var CommonModalEventsMixin = require('./../../mixins/CommonModalEventsMixin');

var NewExpenseModal = React.createClass({

  mixins : [CommonModalEventsMixin],
  
  
  getInitialState : function () {
    
    return ({
      ammount : ''
      , new_date : null
    });
    
  },

  handleClose: function (e) {
    if (_.isFunction(this.props.callback_onclose)) {
      this.props.callback_onclose('atm');
    }
  },

  render: function () {
    
    return (
      <div>
        <Modal 
          header='Add ATM Cashout'
          bsStyle='primary'
          backdrop={true}
          animation={true}
          onHide={this.handleClose}>
          <div className='modal-body'>
            <Input type='text' ref='ammount' addonBefore='Ammount' placeholder={Numeral(2000.96).format('0,0[.]00')} onChange={this.handleChangeAmmount} value={this.state.ammount} buttonAfter={this.props.currencyDropdown} onFocus={this.handleFocusAmmount} onBlur={this.handleBlurAmmount} />
            
            <div className='form-group'>  
              <div className="input-group">
                <span className="input-group-addon">Date</span> 
                <DatePicker
                  key="date"
                  dateFormat="LL"
                  selected={this.state.new_date}
                  onChange={this.handleNewDateChange}
                  ref = 'date'
                  placeholderText={Moment().format('LL')}
                />
              </div>
            </div>
            
            <Input type='text' ref='account' addonBefore='From' placeholder='TSB' />
            <Input type='text' ref='note' addonBefore='Note' placeholder='Grocery Store' />
          </div>
          <div className='modal-footer'>
            <Button onClick={this.handleClose} >Close</Button>
            <Button onClick={this.handleSave} bsStyle='primary'>Add withdraw</Button>
          </div>
        </Modal>
        
      </div>
    );
  }
});


module.exports = NewExpenseModal;