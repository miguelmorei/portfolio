import $ from 'jquery';
import moment from 'moment';
import axios from 'axios';

import Utils from '../utils/utils';

class CustomForm {

    constructor(el, options) {
        this.element = el;
        
        this.options = options || {};


        this.action = this.options.action || $(el).attr('action');
        this.method = this.options.method || 'POST';
        this.addData = this.options.addData || false;
        this.successCallback = this.options.success;
        this.errorCallback = this.options.error;
        this.onSubmit = this.options.onSubmit;
        this.errors = this.element.find('.form-default__errors');
        this.activeErrors = 0;
    }

    /**
     * Using the initialisation function to attach DOM events
     */
    init() {

        this.element.on('submit', e=>{
            e.preventDefault();
            /**
             * If an onSubmit parameter is provided,
             * we run that before running our own 
             * validate & submit methods
             */
            if(typeof this.onSubmit == "function") { 
                if(this.validate() && this.onSubmit(this)) {
                    this.submit();
                }
            /**
             * Otherwise just validate and submit!
             */
            } else {
                if(this.validate()) {
                    this.submit();
                }
            }
     
        });

        this.element.find('.form-default__success .btn').on('click', (e)=>{

            e.preventDefault();
            this.toggleSuccessMessage();

        });
    }

    /**
     * Custom basic validation 
     * This doesn't cover everything so it's a good idea
     * to add circunstancial validation to the onSubmit 
     * method exposed
     */
    validate () {
        this.activeErrors = 0;
        this.cleanErrors();

        this.element.find('.invalid').removeClass('invalid');

        let $elements = {
            text : this.element.find('input[type="text"], input[type="email"]'),
            email : this.element.find('input[type="email"]'),
            date : this.element.find('input[type="date"], [data-validation="date"]'),
            select : this.element.find('select'),
            checkbox : this.element.find('input[type="checkbox"]'),
            radio : this.element.find('input[type="radio"]'),
        }


        $elements.text.each((i, el)=>{
            if($(el).hasClass('required'))
                if(!this.validateTextField($(el).val())){
                    $(el).addClass('invalid');
                    this.activeErrors++;
                    this.addError(`Field ${$(el).attr('name')} can't be empty`);
                }
                
        });

        $elements.email.each((i, el)=>{
            if($(el).hasClass('required'))
                if(!this.validateEmailAddress($(el).val())) {
                    $(el).addClass('invalid');
                    this.activeErrors++;
                    this.addError(`Please provide a valid email address.`);
                }
        });

        $elements.date.each((i, el)=>{
            if($(el).hasClass('required'))
                if(!this.validateDate($(el).val())) {
                    $(el).addClass('invalid');
                    this.activeErrors++;
                    this.addError(`Invalid date provided for ${$(el).attr('name')}. Please use DD/MM/YY format.`)
                }
        });

        $elements.checkbox.each((i, el)=>{
            if(!this.validateCheckbox(el)){
                $(el).addClass('invalid');
                this.activeErrors++;
                this.addError(`Please tick ${$(el).attr('name')}.`);
            }
        });

        $elements.select.each((i, el)=>{
            if(!this.validateSelect(el)){
                $(el).addClass('invalid');
                this.activeErrors++;
                this.addError(`Please select ${$(el).attr('name')}`);
            }
        });

        $elements.radio.each((i, el)=>{
            if(!this.validateRadio(el)){
                $(el).addClass('invalid');
                this.activeErrors++;
            } 
        });

        return this.activeErrors == 0;
    }


    /**
     * 
     * @param {*} input 
     */

    validateRadio(el) {

        const target = $(el).attr('name');

        let valid = false;
            

        $(`input[name="${target}"]`).each((i,el)=>{

            if($(el)[0].checked) {
                valid = true;

                return valid;
            }

        });


        return valid;

    }
     
    /**
     * 
     * @param {*} input 
     */

    validateSelect(el) {

        return el.selectedIndex != 0;

    }

    /**
     * 
     * @param {string} input 
     */
    validateTextField(input) {

        if(typeof input != "string") return false;

        return typeof input == "string" && input.trim('') != ""

    }

    /**
     * 
     * @param {*} input 
     */
    validateCheckbox (el) {

        return el.checked;

    }

    /**
     * 
     * @param {string} input 
     */
    validateEmailAddress(input) {

        if(typeof input != "string") return false;
        
        const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return input.match(regEmail)

    }

    /**
     * 
     * @param {string} input 
     */
    validateDate(input) {

        if(typeof input != "string") return false;

        return moment(input, 'DD/MM/YY', true).isValid();

    }


    /**
     * Transform a serialized form into a JSON object we can 
     * pass through to our data object
     */
    collateData() {

        const collatedData = this.queryStringToJSON(this.element.serialize());

        return collatedData;

    }

    cleanErrors () {
        this.errors.html('');
    }


    /**
     * 
     * @param {string} msg 
     */
    addError(msg) {

        this.errors.append(`<p>${msg}</p>`);

    }

    /**
     * Parse a query string into a JSON object
     * @param {string} input 
     */
    queryStringToJSON(input) {            
        var pairs = input.split('&');
        
        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
    
        return JSON.parse(JSON.stringify(result));
    }
    

    toggleSuccessMessage() {


        if(!this.element.hasClass('form-default_display-success')) {
            this.element.addClass('form-default_display-success');
        } else {
            this.element.removeClass('form-default_display-success');
        }   
        

    }


    
    /**
     * Reset form values
     */

     emptyForm() {

        let $elements = {
            text : this.element.find('input[type="text"], input[type="email"]'),
            email : this.element.find('input[type="email"]'),
            date : this.element.find('input[type="date"], [data-validation="date"]'),
            select : this.element.find('select'),
            checkbox : this.element.find('input[type="checkbox"]')
        }

        $elements.text.val('');
        $elements.email.val('');
        $elements.date.val('');
        $elements.select.each(function(){
            $(this)[0].selectedIndex = 0;
        });
        $elements.checkbox.prop('checked', false);

     }

    submit() {

        const data = this.collateData();
        this.data = data;

         axios.post(this.action, this.data)
             .then(res=>{
       
                this.toggleSuccessMessage();
                

                this.emptyForm();
                

                if(typeof this.successCallback == "function") {
                    
                    this.successCallback(res);

                    return;
                }

         
             })
             .catch(err=>{
                 if(typeof this.errorCallback == "function") {
                     this.errorCallback(err);
                 }
             }) 
    }

}

export default CustomForm;