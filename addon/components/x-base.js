/* globals calculateSize, WebFont */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  errorMessage: false,
  isEditing: false,
  mouseInsideComponent: false,
  originalValue: null,
  isValid: Ember.computed('errorMessage', function() {
    return !this.get('errorMessage') ? true : false;
  }),
  /**
   * Sets the isFieldEditing property to the current isEditing status.
   * This is used to pass isEditing out to the controller, if you need it
   */
  setFieldIsEditing: Ember.observer('isEditing', function() {
    this.set('isFieldEditing', this.get('isEditing'));
  }),
  focusIn() {
    if (this.get('value') === 'Empty') {
      this.set('value', '');
    }
    this.set('isValid', true);
    this.set('isEditing', true);
  },
  focusOut() {
    if (!this.get('mouseInsideComponent')) {
      this.send('cancelAction');
    }
  },
  mouseEnter() {
    this.set('mouseInsideComponent', true);
  },
  mouseLeave() {
    this.set('mouseInsideComponent', false);
  },
  /**
   * Calculate the width of a text string, given the element to grab styles from and the text string
   * @param element The element the text is inside, this is used to get font size, weight, etc
   * @param text The text string we are measuring
   * @returns {*}
   */
  getTextWidth(element, text) {
    const fontFamily = element.css('font-family');
    const fontSize = element.css('font-size');
    const fontWeight = element.css('font-weight');
    return calculateSize(text, {
      font: fontFamily,
      fontSize: fontSize,
      fontWeight: fontWeight
    });
  },
  saveNewValue() {
    //If no errors, go ahead and save
    if (!this.get('errorMessage')) {
      this.set('isEditing', false);
      this.changeUnderlineSize();
      this.sendAction('saveAction');
    }
  },
  actions: {
    cancelAction() {
      this.set('isEditing', false);
      this.set('value', this.get('originalValue'));
      this.set('errorMessage', false);
      this.sendAction('cancelAction');
    },
    saveAction() {
      const validator = this.get('validator');
      //Do any validation here, before saving
      if (validator) {
        this.set('errorMessage', this.get('validator')(this.get('value')));

        //If no errors, update the originalValue to be the newly saved value
        if (!this.get('errorMessage')) {
          this.set('originalValue', this.get('value'));
        }
      }
      else {
        this.set('originalValue', this.get('value'));
      }
      this.saveNewValue();
    }
  },
  didInsertElement() {
    Ember.run.later(() => {
      const afterRenderLogic = () => {
        //TODO fix this empty text handling
        //this.handleEmptyTextValue();
        //Store the original value, so we can restore it on cancel click
        this.set('originalValue', this.get('value'));

        if (this.get('value')) {
          this.changeUnderlineSize();
        }
      };

      // If custom font families are being loaded with @font-face,
      // we need to wait until the font is loaded to display the inputs
      if (this.get('fontFamilyConfig')) {
        WebFont.load({
          custom: {
            families: this.get('fontFamilyConfig')
          },
          active: afterRenderLogic
        });
      }
      else {
        afterRenderLogic();
      }
    });
  }
});
