'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reducerAndActions = require('./reducerAndActions');

var _reactAutowhatever = require('react-autowhatever');

var _reactAutowhatever2 = _interopRequireDefault(_reactAutowhatever);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapStateToProps(state) {
  return {
    isFocused: state.isFocused,
    isCollapsed: state.isCollapsed,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex,
    valueBeforeUpDown: state.valueBeforeUpDown,
    lastAction: state.lastAction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    inputFocused: function inputFocused(shouldRenderSuggestions) {
      dispatch((0, _reducerAndActions.inputFocused)(shouldRenderSuggestions));
    },
    inputBlurred: function inputBlurred() {
      dispatch((0, _reducerAndActions.inputBlurred)());
    },
    inputChanged: function inputChanged(shouldRenderSuggestions, lastAction) {
      dispatch((0, _reducerAndActions.inputChanged)(shouldRenderSuggestions, lastAction));
    },
    updateFocusedSuggestion: function updateFocusedSuggestion(sectionIndex, suggestionIndex, value) {
      dispatch((0, _reducerAndActions.updateFocusedSuggestion)(sectionIndex, suggestionIndex, value));
    },
    revealSuggestions: function revealSuggestions() {
      dispatch((0, _reducerAndActions.revealSuggestions)());
    },
    closeSuggestions: function closeSuggestions(lastAction) {
      dispatch((0, _reducerAndActions.closeSuggestions)(lastAction));
    }
  };
}

function extractTouchCoordinates(_ref) {
  var changedTouches = _ref.changedTouches;

  return { x: changedTouches[0].pageX, y: changedTouches[0].pageY };
}

var Autosuggest = _react2.default.createClass({
  displayName: 'Autosuggest',

  propTypes: {
    suggestions: _react.PropTypes.array.isRequired,
    onSuggestionsUpdateRequested: _react.PropTypes.func.isRequired,
    getSuggestionValue: _react.PropTypes.func.isRequired,
    renderSuggestion: _react.PropTypes.func.isRequired,
    renderInput: _react.PropTypes.func,
    inputProps: _react.PropTypes.object.isRequired,
    shouldRenderSuggestions: _react.PropTypes.func.isRequired,
    onSuggestionSelected: _react.PropTypes.func.isRequired,
    multiSection: _react.PropTypes.bool.isRequired,
    renderSectionTitle: _react.PropTypes.func.isRequired,
    getSectionSuggestions: _react.PropTypes.func.isRequired,
    focusInputOnSuggestionClick: _react.PropTypes.bool.isRequired,
    blurOnSuggestionSelect: _react.PropTypes.bool.isRequired,
    theme: _react.PropTypes.object.isRequired,
    id: _react.PropTypes.string.isRequired,
    inputRef: _react.PropTypes.func.isRequired,

    isFocused: _react.PropTypes.bool.isRequired,
    isCollapsed: _react.PropTypes.bool.isRequired,
    focusedSectionIndex: _react.PropTypes.number,
    focusedSuggestionIndex: _react.PropTypes.number,
    wrapItemFocus: _react.PropTypes.bool,
    valueBeforeUpDown: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
    lastAction: _react.PropTypes.string,

    inputFocused: _react.PropTypes.func.isRequired,
    inputBlurred: _react.PropTypes.func.isRequired,
    inputChanged: _react.PropTypes.func.isRequired,
    updateFocusedSuggestion: _react.PropTypes.func.isRequired,
    revealSuggestions: _react.PropTypes.func.isRequired,
    closeSuggestions: _react.PropTypes.func.isRequired
  },

  componentWillMount: function componentWillMount() {
    this.justTouchedInput = false;
    this.touchStart = null;
    this.justClickedOnSuggestion = false;
  },
  componentDidMount: function componentDidMount() {
    global.window.addEventListener('touchstart', this.onDocumentTouchStart, false);
    global.window.addEventListener('touchend', this.onDocumentTouchEnd, false);
    global.window.addEventListener('mouseup', this.onDocumentMouseUp, false);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      var suggestions = nextProps.suggestions;
      var inputProps = nextProps.inputProps;
      var shouldRenderSuggestions = nextProps.shouldRenderSuggestions;
      var isCollapsed = nextProps.isCollapsed;
      var revealSuggestions = nextProps.revealSuggestions;
      var lastAction = nextProps.lastAction;
      var value = inputProps.value;


      if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter' && suggestions.length > 0 && shouldRenderSuggestions(value)) {
        revealSuggestions();
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    global.window.removeEventListener('touchstart', this.onDocumentTouchStart, false);
    global.window.removeEventListener('touchend', this.onDocumentTouchEnd, false);
    global.window.removeEventListener('mouseup', this.onDocumentMouseUp, false);
  },
  onDocumentTouchStart: function onDocumentTouchStart(event) {
    this.touchStart = this.touchStart || extractTouchCoordinates(event);
  },
  onDocumentTouchEnd: function onDocumentTouchEnd(event) {
    var _this = this;

    var _extractTouchCoordina = extractTouchCoordinates(event);

    var x = _extractTouchCoordina.x;
    var y = _extractTouchCoordina.y;


    if (this.props.isFocused && !this.justTouchedInput && !this.justClickedOnSuggestion && this.touchStart) {
      var dx = Math.abs(x - this.touchStart.x);
      var dy = Math.abs(y - this.touchStart.y);

      if (dx < 20 && dy < 20) {
        this.input.blur();
      }
    }
    this.justTouchedInput = false;
    this.touchStart = null;
    setTimeout(function () {
      return _this.justClickedOnSuggestion = false;
    });
  },
  onDocumentMouseUp: function onDocumentMouseUp() {
    var _this2 = this;

    setTimeout(function () {
      return _this2.justClickedOnSuggestion = false;
    });
  },
  getSuggestion: function getSuggestion(sectionIndex, suggestionIndex) {
    var _props = this.props;
    var suggestions = _props.suggestions;
    var multiSection = _props.multiSection;
    var getSectionSuggestions = _props.getSectionSuggestions;


    if (multiSection) {
      return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
    }

    return suggestions[suggestionIndex];
  },
  getFocusedSuggestion: function getFocusedSuggestion() {
    var _props2 = this.props;
    var focusedSectionIndex = _props2.focusedSectionIndex;
    var focusedSuggestionIndex = _props2.focusedSuggestionIndex;


    if (focusedSuggestionIndex === null) {
      return null;
    }

    return this.getSuggestion(focusedSectionIndex, focusedSuggestionIndex);
  },
  getSuggestionValueByIndex: function getSuggestionValueByIndex(sectionIndex, suggestionIndex) {
    var getSuggestionValue = this.props.getSuggestionValue;


    return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
  },
  getSuggestionIndices: function getSuggestionIndices(suggestionElement) {
    var sectionIndex = suggestionElement.getAttribute('data-section-index');
    var suggestionIndex = suggestionElement.getAttribute('data-suggestion-index');

    return {
      sectionIndex: typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null,
      suggestionIndex: parseInt(suggestionIndex, 10)
    };
  },
  findSuggestionElement: function findSuggestionElement(startNode) {
    var node = startNode;

    do {
      if (node.getAttribute('data-suggestion-index') !== null) {
        return node;
      }

      node = node.parentNode;
    } while (node !== null);

    console.error('Clicked element:', startNode); // eslint-disable-line no-console
    throw new Error('Couldn\'t find suggestion element');
  },
  maybeCallOnChange: function maybeCallOnChange(event, newValue, method) {
    var _props$inputProps = this.props.inputProps;
    var value = _props$inputProps.value;
    var onChange = _props$inputProps.onChange;


    if (newValue !== value) {
      onChange && onChange(event, { newValue: newValue, method: method });
    }
  },
  maybeCallOnSuggestionsUpdateRequested: function maybeCallOnSuggestionsUpdateRequested(data) {
    var _props3 = this.props;
    var onSuggestionsUpdateRequested = _props3.onSuggestionsUpdateRequested;
    var shouldRenderSuggestions = _props3.shouldRenderSuggestions;


    if (shouldRenderSuggestions(data.value)) {
      onSuggestionsUpdateRequested(data);
    }
  },
  willRenderSuggestions: function willRenderSuggestions() {
    var _props4 = this.props;
    var suggestions = _props4.suggestions;
    var inputProps = _props4.inputProps;
    var shouldRenderSuggestions = _props4.shouldRenderSuggestions;
    var value = inputProps.value;


    return suggestions.length > 0 && shouldRenderSuggestions(value);
  },
  saveInput: function saveInput(autowhatever) {
    if (autowhatever !== null) {
      var input = autowhatever.refs.input;

      this.input = input;
      this.props.inputRef(input);
    }
  },
  render: function render() {
    var _this3 = this;

    var _props5 = this.props;
    var suggestions = _props5.suggestions;
    var renderSuggestion = _props5.renderSuggestion;
    var inputProps = _props5.inputProps;
    var shouldRenderSuggestions = _props5.shouldRenderSuggestions;
    var onSuggestionSelected = _props5.onSuggestionSelected;
    var multiSection = _props5.multiSection;
    var renderSectionTitle = _props5.renderSectionTitle;
    var id = _props5.id;
    var getSectionSuggestions = _props5.getSectionSuggestions;
    var focusInputOnSuggestionClick = _props5.focusInputOnSuggestionClick;
    var theme = _props5.theme;
    var isFocused = _props5.isFocused;
    var isCollapsed = _props5.isCollapsed;
    var focusedSectionIndex = _props5.focusedSectionIndex;
    var focusedSuggestionIndex = _props5.focusedSuggestionIndex;
    var valueBeforeUpDown = _props5.valueBeforeUpDown;
    var inputFocused = _props5.inputFocused;
    var inputBlurred = _props5.inputBlurred;
    var inputChanged = _props5.inputChanged;
    var updateFocusedSuggestion = _props5.updateFocusedSuggestion;
    var revealSuggestions = _props5.revealSuggestions;
    var closeSuggestions = _props5.closeSuggestions;
    var renderInput = _props5.renderInput;
    var wrapItemFocus = _props5.wrapItemFocus;
    var blurOnSuggestionSelect = _props5.blurOnSuggestionSelect;
    var value = inputProps.value;
    var _onBlur = inputProps.onBlur;
    var _onFocus = inputProps.onFocus;
    var _onKeyDown = inputProps.onKeyDown;

    var isOpen = isFocused && !isCollapsed && this.willRenderSuggestions();
    var items = isOpen ? suggestions : [];
    var autowhateverInputProps = _extends({}, inputProps, {
      onTouchStart: function onTouchStart() {
        return _this3.justTouchedInput = true;
      },
      onFocus: function onFocus(event) {
        if (!_this3.justClickedOnSuggestion) {
          inputFocused(shouldRenderSuggestions(value));
          _onFocus && _onFocus(event);
        }
      },
      onBlur: function onBlur(event) {
        _this3.onBlurEvent = event;

        if (!_this3.justClickedOnSuggestion) {
          inputBlurred();
          _onBlur && _onBlur(event);

          if (valueBeforeUpDown !== null && value !== valueBeforeUpDown) {
            _this3.maybeCallOnSuggestionsUpdateRequested({ value: value, reason: 'blur' });
          }
        }
      },
      onChange: function onChange(event) {
        var value = event.target.value;
        var shouldRenderSuggestions = _this3.props.shouldRenderSuggestions;


        _this3.maybeCallOnChange(event, value, 'type');
        inputChanged(shouldRenderSuggestions(value), 'type');
        _this3.maybeCallOnSuggestionsUpdateRequested({ value: value, reason: 'type' });
      },
      onKeyDown: function onKeyDown(event, data) {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            if (isCollapsed) {
              if (_this3.willRenderSuggestions()) {
                revealSuggestions();
              }
            } else if (suggestions.length > 0) {
              var newFocusedSectionIndex = data.newFocusedSectionIndex;
              var newFocusedItemIndex = data.newFocusedItemIndex;

              var newValue = newFocusedItemIndex === null ? valueBeforeUpDown : _this3.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);

              updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
              _this3.maybeCallOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
            }
            event.preventDefault();
            break;

          case 'Enter':
            {
              var focusedSuggestion = _this3.getFocusedSuggestion();

              closeSuggestions('enter');

              if (focusedSuggestion !== null) {
                onSuggestionSelected(event, {
                  suggestion: focusedSuggestion,
                  suggestionValue: value,
                  sectionIndex: focusedSectionIndex,
                  method: 'enter'
                });
                _this3.maybeCallOnSuggestionsUpdateRequested({ value: value, reason: 'enter' });
              }
              if (blurOnSuggestionSelect) {
                _this3.input.blur();
              }
              break;
            }

          case 'Escape':
            if (isOpen) {
              // If input.type === 'search', the browser clears the input
              // when Escape is pressed. We want to disable this default
              // behaviour so that, when suggestions are shown, we just hide
              // them, without clearing the input.
              event.preventDefault();
            }

            if (valueBeforeUpDown === null) {
              // Didn't interact with Up/Down
              if (!isOpen) {
                _this3.maybeCallOnChange(event, '', 'escape');
                _this3.maybeCallOnSuggestionsUpdateRequested({ value: '', reason: 'escape' });
              }
            } else {
              // Interacted with Up/Down
              _this3.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
            }

            closeSuggestions('escape');

            if (blurOnSuggestionSelect) {
              _this3.input.blur();
            }
            break;
        }

        _onKeyDown && _onKeyDown(event);
      }
    });
    var onMouseEnter = function onMouseEnter(event, _ref2) {
      var sectionIndex = _ref2.sectionIndex;
      var itemIndex = _ref2.itemIndex;

      updateFocusedSuggestion(sectionIndex, itemIndex);
    };
    var onMouseLeave = function onMouseLeave() {
      updateFocusedSuggestion(null, null);
    };
    var onMouseDown = function onMouseDown() {
      _this3.justClickedOnSuggestion = true;
    };
    var onClick = function onClick(event) {
      var _getSuggestionIndices = _this3.getSuggestionIndices(_this3.findSuggestionElement(event.target));

      var sectionIndex = _getSuggestionIndices.sectionIndex;
      var suggestionIndex = _getSuggestionIndices.suggestionIndex;

      var clickedSuggestion = _this3.getSuggestion(sectionIndex, suggestionIndex);
      var clickedSuggestionValue = _this3.props.getSuggestionValue(clickedSuggestion);

      _this3.maybeCallOnChange(event, clickedSuggestionValue, 'click');
      onSuggestionSelected(event, {
        suggestion: clickedSuggestion,
        suggestionValue: clickedSuggestionValue,
        sectionIndex: sectionIndex,
        method: 'click'
      });
      closeSuggestions('click');

      if (focusInputOnSuggestionClick === true) {
        _this3.input.focus();
      } else {
        inputBlurred();
        _onBlur && _onBlur(_this3.onBlurEvent);
      }

      _this3.maybeCallOnSuggestionsUpdateRequested({ value: clickedSuggestionValue, reason: 'click' });
    };
    var itemProps = function itemProps(_ref3) {
      var sectionIndex = _ref3.sectionIndex;
      var itemIndex = _ref3.itemIndex;

      return {
        'data-section-index': sectionIndex,
        'data-suggestion-index': itemIndex,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onMouseDown: onMouseDown,
        onTouchStart: onMouseDown, // Because on iOS `onMouseDown` is not triggered
        onClick: onClick
      };
    };
    var renderItem = function renderItem(item) {
      return renderSuggestion(item, { value: value, valueBeforeUpDown: valueBeforeUpDown });
    };

    return _react2.default.createElement(_reactAutowhatever2.default, { multiSection: multiSection,
      items: items,
      renderItem: renderItem,
      renderInput: renderInput,
      renderSectionTitle: renderSectionTitle,
      getSectionItems: getSectionSuggestions,
      focusedSectionIndex: focusedSectionIndex,
      focusedItemIndex: focusedSuggestionIndex,
      wrapItemFocus: wrapItemFocus,
      inputProps: autowhateverInputProps,
      itemProps: itemProps,
      theme: theme,
      id: id,
      ref: this.saveInput });
  }
});

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Autosuggest);