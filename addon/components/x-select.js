import Ember from 'ember';
import XBaseComponent from './x-base';

export default XBaseComponent.extend({
  changeUnderlineSize: Ember.observer('isEditing', function() {
    Ember.run.later(() => {
      if (!this.get('isEditing')) {
        const size = this.getTextWidth(this.$('select'), this.$('select option:selected').text());
        this.$('.selectContainer').css('width', 'auto');
        this.$('.selectContainer').height(size.height + 8);
        this.$('select').width(size.width);
        this.$('select').height(size.height + 7);
        this.$('.borderBottom').css('width', size.width);
      }
      else {
        this.$('.selectContainer').css('width', '68%');
        this.$('.selectContainer').height('auto');
        this.$('select').css('width', '100%');
      }
    });
  })
});
