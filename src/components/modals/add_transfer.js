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
var Moment = require('moment');
var Numeral = require('numeral');
Numeral.defaultFormat('0,0[.]00');
var DatePicker = require('react-datepicker');
var CommonModalEventsMixin = require('./../../mixins/CommonModalEventsMixin');

var NewExpenseModal = React.createClass({

  mixins : [CommonModalEventsMixin],
  
  
  getInitialState : function () {
    
    return ({
      ammount : ''
    });
    
  },

  handleClose: function (e) {
    if (_.isFunction(this.props.callback_onclose)) {
      this.props.callback_onclose('transfer');
    }
  },

  render: function () {
    
    return (
      <div>
        <Modal 
          header='Add new transfer between accounts'
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
            <Input type='text' ref='accountFrom' addonBefore='From' placeholder='Cash on hand' />
            <Input type='text' ref='accountTo' addonBefore='To' placeholder='Grocery Store' />
            <Input type='text' ref='note' addonBefore='Note' placeholder='Grocery Store' />
          </div>
          <div className='modal-footer'>
            <Button onClick={this.handleClose} >Close</Button>
            <Button onClick={this.handleSave} bsStyle='primary'>Add Transfer</Button>
          </div>
        </Modal>
        
      </div>
    );
  }
});


module.exports = NewExpenseModal;