'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reducerAndActions = require('./reducerAndActions');

var _reducerAndActions2 = _interopRequireDefault(_reducerAndActions);

var _Autosuggest = require('./Autosuggest');

var _Autosuggest2 = _interopRequireDefault(_Autosuggest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}

var defaultTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestion: 'react-autosuggest__suggestion',
  suggestionFocused: 'react-autosuggest__suggestion--focused',
  sectionContainer: 'react-autosuggest__section-container',
  sectionTitle: 'react-autosuggest__section-title',
  sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container'
};

function mapToAutowhateverTheme(theme) {
  var result = {};

  for (var key in theme) {
    switch (key) {
      case 'suggestionsContainer':
        result['itemsContainer'] = theme[key];
        break;

      case 'suggestion':
        result['item'] = theme[key];
        break;

      case 'suggestionFocused':
        result['itemFocused'] = theme[key];
        break;

      case 'sectionSuggestionsContainer':
        result['sectionItemsContainer'] = theme[key];
        break;

      default:
        result[key] = theme[key];
    }
  }

  return result;
}

exports.default = _react2.default.createClass({
  displayName: 'AutosuggestContainer',

  propTypes: {
    suggestions: _react.PropTypes.array.isRequired,
    onSuggestionsUpdateRequested: _react.PropTypes.func,
    getSuggestionValue: _react.PropTypes.func.isRequired,
    renderSuggestion: _react.PropTypes.func.isRequired,
    renderInput: _react.PropTypes.func,
    inputProps: function inputProps(props, propName) {
      var inputProps = props[propName];

      if (!inputProps.hasOwnProperty('value')) {
        throw new Error('\'inputProps\' must have \'value\'.');
      }

      if (!inputProps.hasOwnProperty('onChange')) {
        throw new Error('\'inputProps\' must have \'onChange\'.');
      }
    },
    shouldRenderSuggestions: _react.PropTypes.func,
    onSuggestionSelected: _react.PropTypes.func,
    multiSection: _react.PropTypes.bool,
    renderSectionTitle: _react.PropTypes.func,
    getSectionSuggestions: _react.PropTypes.func,
    focusInputOnSuggestionClick: _react.PropTypes.bool,
    blurOnSuggestionSelect: _react.PropTypes.bool,
    wrapItemFocus: _react.PropTypes.bool,
    theme: _react.PropTypes.object,
    id: _react.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      onSuggestionsUpdateRequested: noop,
      shouldRenderSuggestions: function shouldRenderSuggestions(value) {
        return value.trim().length > 0;
      },
      onSuggestionSelected: noop,
      multiSection: false,
      renderSectionTitle: function renderSectionTitle() {
        throw new Error('`renderSectionTitle` must be provided');
      },
      getSectionSuggestions: function getSectionSuggestions() {
        throw new Error('`getSectionSuggestions` must be provided');
      },

      focusInputOnSuggestionClick: true,
      blurOnSuggestionSelect: false,
      wrapItemFocus: true,
      theme: defaultTheme,
      id: '1'
    };
  },
  componentWillMount: function componentWillMount() {
    var initialState = {
      isFocused: false,
      isCollapsed: true,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      lastAction: null
    };

    this.store = (0, _redux.createStore)(_reducerAndActions2.default, initialState);
  },
  saveInput: function saveInput(input) {
    this.input = input;
  },
  render: function render() {
    var _props = this.props;
    var multiSection = _props.multiSection;
    var shouldRenderSuggestions = _props.shouldRenderSuggestions;
    var suggestions = _props.suggestions;
    var onSuggestionsUpdateRequested = _props.onSuggestionsUpdateRequested;
    var getSuggestionValue = _props.getSuggestionValue;
    var renderSuggestion = _props.renderSuggestion;
    var renderSectionTitle = _props.renderSectionTitle;
    var getSectionSuggestions = _props.getSectionSuggestions;
    var inputProps = _props.inputProps;
    var onSuggestionSelected = _props.onSuggestionSelected;
    var focusInputOnSuggestionClick = _props.focusInputOnSuggestionClick;
    var theme = _props.theme;
    var id = _props.id;
    var renderInput = _props.renderInput;
    var wrapItemFocus = _props.wrapItemFocus;
    var blurOnSuggestionSelect = _props.blurOnSuggestionSelect;


    return _react2.default.createElement(_Autosuggest2.default, { multiSection: multiSection,
      shouldRenderSuggestions: shouldRenderSuggestions,
      suggestions: suggestions,
      onSuggestionsUpdateRequested: onSuggestionsUpdateRequested,
      getSuggestionValue: getSuggestionValue,
      renderSuggestion: renderSuggestion,
      renderInput: renderInput,
      renderSectionTitle: renderSectionTitle,
      getSectionSuggestions: getSectionSuggestions,
      inputProps: inputProps,
      onSuggestionSelected: onSuggestionSelected,
      focusInputOnSuggestionClick: focusInputOnSuggestionClick,
      blurOnSuggestionSelect: blurOnSuggestionSelect,
      wrapItemFocus: wrapItemFocus,
      theme: mapToAutowhateverTheme(theme),
      id: id,
      inputRef: this.saveInput,
      store: this.store });
  }
});