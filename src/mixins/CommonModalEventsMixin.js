var React = require('react');
var _ = require('underscore');
var Moment = require('moment');
var Numeral = require('numeral');

var CommonModalEventsMixin = {
  
    
  handleNewDateChange: function(date) {
    this.setState({
      new_date: date
    });
    
  },
  
  handleChangeAmmount : function(event) {
    this.setState({ammount : event.target.value});
  },

  handleBlurAmmount : function(e) {
    if (this.refs.ammount.getValue() != '') {
      var V = Numeral(this.refs.ammount.getValue()).format('0,0[.]00');
      this.setState({ammount : V});
    }
  },
  
  handleFocusAmmount : function(e) {
    var V = Numeral().unformat(this.refs.ammount.getValue());
    if (V == 0) V ='';
    this.setState({ammount : V});
  },
  
  handleSave: function (e) {
    
    if (_.isFunction(this.props.callback_onsave)) {
      
      if (typeof this.refs.accountTo == 'undefined')
        this.props.callback_onsave([Numeral().unformat(this.refs.ammount.getValue())*100,this.state.new_date,this.refs.account.getValue(),this.refs.note.getValue()]);
      else
        this.props.callback_onsave([Numeral().unformat(this.refs.ammount.getValue())*100,this.state.new_date,this.refs.accountFrom.getValue(),this.refs.accountTo.getValue(),this.refs.note.getValue()]);
      
    }
    
    this.handleClose(e);
  }
  
}

module.exports = CommonModalEventsMixin;