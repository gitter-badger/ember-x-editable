import Ember from 'ember';
import XBaseComponent from './x-base';

export default XBaseComponent.extend({
  changeUnderlineSize: Ember.observer('isEditing', function() {
    Ember.run.later(() => {
      if (!this.get('isEditing')) {
        if (this.get('value') && this.get('value').length > 0) {
          const size = this.getTextWidth(this.$('input'), this.get('value'));
          this.$('.textContainer').width('68%');
          this.$('input').width(size.width + 10);
          this.$('.borderBottom').width(size.width);
        }
      }
    });
  }),
  /**
   * This is a computed property for adding/removing the is-empty class
   */
  isEmpty: Ember.computed('isEditing', function() {
    if (!this.get('isEditing')) {
      if (!this.get('value') || this.get('value') === '' || this.get('value') === 'Empty') {
        return true;
      }
    }
    return false;
  }),
  makeFullWidthWhenEditing: Ember.observer('isEditing', function() {
    this.$('input').width('100%');
  }),
  /**
   * Set the value to the string 'Empty' when value is null, undefined, or ''.
   */
  handleEmptyValue() {
    if (!this.get('value') || this.get('value') === '') {
      this.set('value', 'Empty');
    }
  },
  actions: {
    saveAction(){
      if (!this.get('validator')) {
        this.handleEmptyValue();
      }
      this._super.apply(this, arguments);
    }
  }
});
