// Backbone.StructuredModelBinder v0.0.1
//
// Copyright (c) 2012 Benjamin Aghaeipour
// Distributed under MIT License


(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['underscore', 'jquery', 'backbone'], factory);
  } else {
      // Browser globals
      factory(_, $, Backbone);
  }
}(function(_, $, Backbone){
/*jshint debug:true */
Backbone.StructuredModelBinder = (function(_, $, Backbone){

  var ModelBinder = {};

  ModelBinder = function(options){
    this.defaultOptions = options || {};
  };

  _.extend(ModelBinder, {
    VERSION: '0.0.1',
    Constants: {
      ModelToView: 'ModelToView',
      ViewToModel: 'ViewToModel'
    },

    //Objects
    Helpers: {},
    Model: {},

    //Functions
    bind: function(model, el, bindingsCollection, options){
      this.unbind();
      console.log('binding modelbinder');
      
      this._model = model;
      this._rootEl = el;
      this._options = _.extend({}, this._modelSetOptions, options);

      if (!this._model) { throw 'model must be specified'; }
      if (!this._rootEl) { throw 'el must be specified'; } 
      if (!bindingsCollection) { throw 'bindingsCollection must be specified (for now)'; }

      // if(uiCollection){
      //   this._uiCollection = $.extend(true, {}, bindingsCollection);
      this._initUIBindings(bindingsCollection);
      //}

      this._bindModelToView();
      this._bindViewToModel();

      _.extend(model, this.Model);
    },

    //Unbind
    unbind: function(){
      console.log('unbinding modelbinder');
      this._unbindModelToView();
      this._unbindViewToModel();

      if(this._uiCollection){
        delete this._uiCollection;
        this._uiCollection = undefined;
      }
    },

    _bindModelToView: function () {
      this._model.on('change', this._onModelChange, this);

      //this.copyModelAttributesToView();
    },

    _unbindModelToView: function(){
      if(this._model){
        this._model.off('change', this._onModelChange);
        this._model = undefined;
      }
    },

    _bindViewToModel:function () {
      $(this._rootEl).delegate('', 'change', this._onElChanged);
      // The change event doesn't work properly for contenteditable elements - but blur does
      $(this._rootEl).delegate('[contenteditable]', 'blur', this._onElChanged);
    },

    _unbindViewToModel: function(){
      if(this._rootEl){
        $(this._rootEl).undelegate('', 'change', this._onElChanged);
        $(this._rootEl).undelegate('[contenteditable]', 'blur', this._onElChanged);
      }
    },

    _initUIBindings: function(uiCollection){
      var _model, _bindings;
    },

    _deepUIBindings: function(){

    },

    _onModelChange: function(){
      // stub
    },

    _onElChanged: function(){
      // stub
    }

  });

  _.extend(ModelBinder.Model, {

    get: function(attr){
      var attrs = attr.split('.');
      if(attrs.length > 1){
        return this.getDots(this.attributes, attrs);
      }else{
        return Backbone.Model.prototype.get.call(this, attr);
      }
    },

    getDots: function(jsonModel, attrs){
      var modelVal = jsonModel[attrs[0]];
      if(modelVal && attrs.length > 1 && _.isObject(modelVal)){
        attrs.splice(0, 1);
        return this.getDots(modelVal, attrs);
      }else{
        return modelVal;
      }
    },

    set: function(key, value, options){
      console.log('key ' + key + ' value ' + value);
      var attrs, that = this, returns = {};

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      _.each(attrs, function(attrValue, attrKey, kv){
        if(_.isObject(attrValue)){
          console.log('obj');
          if(that.attributes[attrKey]){
            returns[attrKey] = that.setObj(that.attributes, kv, '', options);
          }else{
            returns[attrKey] = 'undefined';
          }
        }else if(attrKey.indexOf('.') !== -1){
          console.log('dot');
          that.setDot(that.attributes, attrKey.split('.'), attrValue, options);
          returns[attrKey] = attrValue;
        }else{
          console.log('normal');
          returns[attrKey] = Backbone.Model.prototype.set.call(that, kv, options);
        }
      });

      return returns;
    },

    /*So we can call from the view, 
     / this.model.set('{ 
     /  a: {
     /   structured: {
     /     model: "value"
     /   }
     /  }
     / }
    */ 
    //Add options.force = create the model structure if not found
    //Call changed event for any properties that have changed
    setObj: function(jsonModel, attrs, value, options){
      var key = attrs[0], modelVal = jsonModel[key];

      if(modelVal && attrs.length > 0 && _.isObject(modelVal)){
        attrs.splice(0, 1);
        _.extend(jsonModel[key], this.setDot(modelVal, attrs, value, options));
      }else{
        jsonModel[key] = value;
      }
      
    },

    //So we can call from the view, this.model.set('a.structured.model', 'value', options)
    //Add options.force = create the model structure if not found
    //Call changed event for any properties that have changed
    setDot: function(jsonModel, dots, value, options){
      var key = dots[0], modelVal = jsonModel[key];

      if(modelVal && dots.length > 0 && _.isObject(modelVal)){
        dots.splice(0, 1);
        _.extend(jsonModel[key], this.setDot(modelVal, dots, value, options));
      }else{
        jsonModel[key] = value;
      }
    }
  });

  return ModelBinder;
}(_, $, Backbone));
 return Backbone.StructuredModelBinder;
}));