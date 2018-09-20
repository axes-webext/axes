'use strict';
var ucs2length = require('ajv/lib/compile/ucs2length');
var equal = require('ajv/lib/compile/equal');
var validate = (function() {
  var pattern0 = new RegExp('^[a-z0-9]+$');
  var pattern1 = new RegExp('^(!|@|#|\\$|%|\\^|&|\\*|_|\\+|-|=|~|\\"|;|:|\\\\|\\||/|\\?|\\.|>|<|,|[a-z0-9]+)?$');
  var pattern2 = new RegExp('^.*$');
  var refVal = [];
  var refVal1 = {
    "$id": "/definitions/actions",
    "$comment": "List of actions from actions.js; to update use Object.keys(require('./src/actions'))",
    "enum": ["autodetect", "show_help", "click", "open_in_new_tab", "open_in_this_tab", "remove", "focus", "trigger_events", "set_value", "download", "copy_contents", "toggle_pause", "mute"]
  };
  refVal[1] = refVal1;
  return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
    'use strict';
    var vErrors = null;
    var errors = 0;
    if ((data && typeof data === "object" && !Array.isArray(data))) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || validate.schema.properties.hasOwnProperty(key0));
        if (isAdditional0) {
          valid1 = false;
          var err = {
            keyword: 'additionalProperties',
            dataPath: (dataPath || '') + "",
            schemaPath: '#/additionalProperties',
            params: {
              additionalProperty: '' + key0 + ''
            },
            message: 'should NOT have additional properties'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
      }
      var data1 = data.version;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'version'
          },
          message: 'should have required property \'version\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data1 === "number") {
          if (data1 > 1 || data1 !== data1) {
            var err = {
              keyword: 'maximum',
              dataPath: (dataPath || '') + '.version',
              schemaPath: '#/properties/version/maximum',
              params: {
                comparison: '<=',
                limit: 1,
                exclusive: false
              },
              message: 'should be <= 1'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1 < 1 || data1 !== data1) {
            var err = {
              keyword: 'minimum',
              dataPath: (dataPath || '') + '.version',
              schemaPath: '#/properties/version/minimum',
              params: {
                comparison: '>=',
                limit: 1,
                exclusive: false
              },
              message: 'should be >= 1'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.version',
            schemaPath: '#/properties/version/type',
            params: {
              type: 'number'
            },
            message: 'should be number'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.labels;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'labels'
          },
          message: 'should have required property \'labels\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
          var errs__1 = errors;
          var valid2 = true;
          for (var key1 in data1) {
            var isAdditional1 = !(false || validate.schema.properties.labels.properties.hasOwnProperty(key1));
            if (isAdditional1) {
              valid2 = false;
              var err = {
                keyword: 'additionalProperties',
                dataPath: (dataPath || '') + '.labels',
                schemaPath: '#/properties/labels/additionalProperties',
                params: {
                  additionalProperty: '' + key1 + ''
                },
                message: 'should NOT have additional properties'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data2 = data1.alphabet;
          if (data2 === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'alphabet'
              },
              message: 'should have required property \'alphabet\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (typeof data2 === "string") {
              if (ucs2length(data2) < 1) {
                var err = {
                  keyword: 'minLength',
                  dataPath: (dataPath || '') + '.labels.alphabet',
                  schemaPath: '#/properties/labels/properties/alphabet/minLength',
                  params: {
                    limit: 1
                  },
                  message: 'should NOT be shorter than 1 characters'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              if (!pattern0.test(data2)) {
                var err = {
                  keyword: 'pattern',
                  dataPath: (dataPath || '') + '.labels.alphabet',
                  schemaPath: '#/properties/labels/properties/alphabet/pattern',
                  params: {
                    pattern: '^[a-z0-9]+$'
                  },
                  message: 'should match pattern "^[a-z0-9]+$"'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.alphabet',
                schemaPath: '#/properties/labels/properties/alphabet/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          if (data1.font === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'font'
              },
              message: 'should have required property \'font\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (typeof data1.font !== "string") {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.font',
                schemaPath: '#/properties/labels/properties/font/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          var data2 = data1.on_scroll;
          if (data2 === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'on_scroll'
              },
              message: 'should have required property \'on_scroll\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (typeof data2 !== "string") {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.on_scroll',
                schemaPath: '#/properties/labels/properties/on_scroll/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var schema2 = validate.schema.properties.labels.properties.on_scroll.enum;
            var valid2;
            valid2 = false;
            for (var i2 = 0; i2 < schema2.length; i2++)
              if (equal(data2, schema2[i2])) {
                valid2 = true;
                break;
              } if (!valid2) {
              var err = {
                keyword: 'enum',
                dataPath: (dataPath || '') + '.labels.on_scroll',
                schemaPath: '#/properties/labels/properties/on_scroll/enum',
                params: {
                  allowedValues: schema2
                },
                message: 'should be equal to one of the allowed values'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          if (data1.exit_on_resize === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'exit_on_resize'
              },
              message: 'should have required property \'exit_on_resize\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (typeof data1.exit_on_resize !== "boolean") {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.exit_on_resize',
                schemaPath: '#/properties/labels/properties/exit_on_resize/type',
                params: {
                  type: 'boolean'
                },
                message: 'should be boolean'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          var data2 = data1.padding;
          if (data2 === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'padding'
              },
              message: 'should have required property \'padding\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (Array.isArray(data2)) {
              if (data2.length > 4) {
                var err = {
                  keyword: 'maxItems',
                  dataPath: (dataPath || '') + '.labels.padding',
                  schemaPath: '#/properties/labels/properties/padding/maxItems',
                  params: {
                    limit: 4
                  },
                  message: 'should NOT have more than 4 items'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              if (data2.length < 4) {
                var err = {
                  keyword: 'minItems',
                  dataPath: (dataPath || '') + '.labels.padding',
                  schemaPath: '#/properties/labels/properties/padding/minItems',
                  params: {
                    limit: 4
                  },
                  message: 'should NOT have less than 4 items'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var errs__2 = errors;
              var valid2;
              for (var i2 = 0; i2 < data2.length; i2++) {
                var data3 = data2[i2];
                var errs_3 = errors;
                if ((typeof data3 !== "number" || (data3 % 1) || data3 !== data3)) {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.labels.padding[' + i2 + ']',
                    schemaPath: '#/properties/labels/properties/padding/items/type',
                    params: {
                      type: 'integer'
                    },
                    message: 'should be integer'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                if (typeof data3 === "number") {
                  if (data3 < 0 || data3 !== data3) {
                    var err = {
                      keyword: 'minimum',
                      dataPath: (dataPath || '') + '.labels.padding[' + i2 + ']',
                      schemaPath: '#/properties/labels/properties/padding/items/minimum',
                      params: {
                        comparison: '>=',
                        limit: 0,
                        exclusive: false
                      },
                      message: 'should be >= 0'
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.padding',
                schemaPath: '#/properties/labels/properties/padding/type',
                params: {
                  type: 'array'
                },
                message: 'should be array'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          var data2 = data1.blink_interval;
          if (data2 === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'blink_interval'
              },
              message: 'should have required property \'blink_interval\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if ((typeof data2 !== "number" || (data2 % 1) || data2 !== data2)) {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.blink_interval',
                schemaPath: '#/properties/labels/properties/blink_interval/type',
                params: {
                  type: 'integer'
                },
                message: 'should be integer'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data2 === "number") {
              if (data2 < 16 || data2 !== data2) {
                var err = {
                  keyword: 'minimum',
                  dataPath: (dataPath || '') + '.labels.blink_interval',
                  schemaPath: '#/properties/labels/properties/blink_interval/minimum',
                  params: {
                    comparison: '>=',
                    limit: 16,
                    exclusive: false
                  },
                  message: 'should be >= 16'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
          }
          var data2 = data1.stroke_styles;
          if (data2 === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'stroke_styles'
              },
              message: 'should have required property \'stroke_styles\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (Array.isArray(data2)) {
              var errs__2 = errors;
              var valid2;
              for (var i2 = 0; i2 < data2.length; i2++) {
                var data3 = data2[i2];
                var errs_3 = errors;
                if ((data3 && typeof data3 === "object" && !Array.isArray(data3))) {
                  var errs__3 = errors;
                  var valid4 = true;
                  for (var key3 in data3) {
                    var isAdditional3 = !(false || key3 == 'selector' || key3 == 'style');
                    if (isAdditional3) {
                      valid4 = false;
                      var err = {
                        keyword: 'additionalProperties',
                        dataPath: (dataPath || '') + '.labels.stroke_styles[' + i2 + ']',
                        schemaPath: '#/properties/labels/properties/stroke_styles/items/additionalProperties',
                        params: {
                          additionalProperty: '' + key3 + ''
                        },
                        message: 'should NOT have additional properties'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  }
                  if (data3.selector !== undefined) {
                    var errs_4 = errors;
                    if (typeof data3.selector !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.labels.stroke_styles[' + i2 + '].selector',
                        schemaPath: '#/properties/labels/properties/stroke_styles/items/properties/selector/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid4 = errors === errs_4;
                  }
                  if (data3.style !== undefined) {
                    var errs_4 = errors;
                    if (typeof data3.style !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.labels.stroke_styles[' + i2 + '].style',
                        schemaPath: '#/properties/labels/properties/stroke_styles/items/properties/style/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid4 = errors === errs_4;
                  }
                } else {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.labels.stroke_styles[' + i2 + ']',
                    schemaPath: '#/properties/labels/properties/stroke_styles/items/type',
                    params: {
                      type: 'object'
                    },
                    message: 'should be object'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.stroke_styles',
                schemaPath: '#/properties/labels/properties/stroke_styles/type',
                params: {
                  type: 'array'
                },
                message: 'should be array'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          if (data1.fill_color === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'fill_color'
              },
              message: 'should have required property \'fill_color\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (typeof data1.fill_color !== "string") {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.fill_color',
                schemaPath: '#/properties/labels/properties/fill_color/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
          if (data1.text_color === undefined) {
            valid2 = false;
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.labels',
              schemaPath: '#/properties/labels/required',
              params: {
                missingProperty: 'text_color'
              },
              message: 'should have required property \'text_color\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_2 = errors;
            if (typeof data1.text_color !== "string") {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.labels.text_color',
                schemaPath: '#/properties/labels/properties/text_color/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.labels',
            schemaPath: '#/properties/labels/type',
            params: {
              type: 'object'
            },
            message: 'should be object'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.hotkeys;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'hotkeys'
          },
          message: 'should have required property \'hotkeys\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (Array.isArray(data1)) {
          var errs__1 = errors;
          var valid1;
          for (var i1 = 0; i1 < data1.length; i1++) {
            var data2 = data1[i1];
            var errs_2 = errors;
            if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
              var errs__2 = errors;
              var valid3 = true;
              for (var key2 in data2) {
                var isAdditional2 = !(false || key2 == 'binding' || key2 == 'action' || key2 == 'global' || key2 == 'preventDefault' || key2 == 'value');
                if (isAdditional2) {
                  valid3 = false;
                  var err = {
                    keyword: 'additionalProperties',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + ']',
                    schemaPath: '#/properties/hotkeys/items/additionalProperties',
                    params: {
                      additionalProperty: '' + key2 + ''
                    },
                    message: 'should NOT have additional properties'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
              }
              if (data2.binding !== undefined) {
                var errs_3 = errors;
                if (typeof data2.binding !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + '].binding',
                    schemaPath: '#/properties/hotkeys/items/properties/binding/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              var data3 = data2.action;
              if (data3 !== undefined) {
                var errs_3 = errors;
                if (typeof data3 !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + '].action',
                    schemaPath: '#/properties/hotkeys/items/properties/action/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var schema3 = validate.schema.properties.hotkeys.items.properties.action.enum;
                var valid3;
                valid3 = false;
                for (var i3 = 0; i3 < schema3.length; i3++)
                  if (equal(data3, schema3[i3])) {
                    valid3 = true;
                    break;
                  } if (!valid3) {
                  var err = {
                    keyword: 'enum',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + '].action',
                    schemaPath: '#/properties/hotkeys/items/properties/action/enum',
                    params: {
                      allowedValues: schema3
                    },
                    message: 'should be equal to one of the allowed values'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.global !== undefined) {
                var errs_3 = errors;
                if (typeof data2.global !== "boolean") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + '].global',
                    schemaPath: '#/properties/hotkeys/items/properties/global/type',
                    params: {
                      type: 'boolean'
                    },
                    message: 'should be boolean'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.preventDefault !== undefined) {
                var errs_3 = errors;
                if (typeof data2.preventDefault !== "boolean") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + '].preventDefault',
                    schemaPath: '#/properties/hotkeys/items/properties/preventDefault/type',
                    params: {
                      type: 'boolean'
                    },
                    message: 'should be boolean'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.value !== undefined) {
                var errs_3 = errors;
                if (typeof data2.value !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.hotkeys[' + i1 + '].value',
                    schemaPath: '#/properties/hotkeys/items/properties/value/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.hotkeys[' + i1 + ']',
                schemaPath: '#/properties/hotkeys/items/type',
                params: {
                  type: 'object'
                },
                message: 'should be object'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.hotkeys',
            schemaPath: '#/properties/hotkeys/type',
            params: {
              type: 'array'
            },
            message: 'should be array'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.message_timeout;
      if (data1 !== undefined) {
        var errs_1 = errors;
        if ((typeof data1 !== "number" || (data1 % 1) || data1 !== data1)) {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.message_timeout',
            schemaPath: '#/properties/message_timeout/type',
            params: {
              type: 'integer'
            },
            message: 'should be integer'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.selectors;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'selectors'
          },
          message: 'should have required property \'selectors\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (Array.isArray(data1)) {
          var errs__1 = errors;
          var valid1;
          for (var i1 = 0; i1 < data1.length; i1++) {
            var data2 = data1[i1];
            var errs_2 = errors;
            if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
              var errs__2 = errors;
              var valid3 = true;
              for (var key2 in data2) {
                var isAdditional2 = !(false || key2 == 'pattern' || key2 == 'selector' || key2 == 'action');
                if (isAdditional2) {
                  valid3 = false;
                  var err = {
                    keyword: 'additionalProperties',
                    dataPath: (dataPath || '') + '.selectors[' + i1 + ']',
                    schemaPath: '#/properties/selectors/items/additionalProperties',
                    params: {
                      additionalProperty: '' + key2 + ''
                    },
                    message: 'should NOT have additional properties'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
              }
              var data3 = data2.pattern;
              if (data3 !== undefined) {
                var errs_3 = errors;
                if ((data3 && typeof data3 === "object" && !Array.isArray(data3))) {
                  var errs__3 = errors;
                  var valid4 = true;
                  for (var key3 in data3) {
                    var isAdditional3 = !(false || key3 == 'type' || key3 == 'value');
                    if (isAdditional3) {
                      valid4 = false;
                      var err = {
                        keyword: 'additionalProperties',
                        dataPath: (dataPath || '') + '.selectors[' + i1 + '].pattern',
                        schemaPath: '#/properties/selectors/items/properties/pattern/additionalProperties',
                        params: {
                          additionalProperty: '' + key3 + ''
                        },
                        message: 'should NOT have additional properties'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  }
                  if (data3.type !== undefined) {
                    var errs_4 = errors;
                    if (typeof data3.type !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.selectors[' + i1 + '].pattern.type',
                        schemaPath: '#/properties/selectors/items/properties/pattern/properties/type/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid4 = errors === errs_4;
                  }
                  if (data3.value !== undefined) {
                    var errs_4 = errors;
                    if (typeof data3.value !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.selectors[' + i1 + '].pattern.value',
                        schemaPath: '#/properties/selectors/items/properties/pattern/properties/value/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid4 = errors === errs_4;
                  }
                } else {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.selectors[' + i1 + '].pattern',
                    schemaPath: '#/properties/selectors/items/properties/pattern/type',
                    params: {
                      type: 'object'
                    },
                    message: 'should be object'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.selector !== undefined) {
                var errs_3 = errors;
                if (typeof data2.selector !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.selectors[' + i1 + '].selector',
                    schemaPath: '#/properties/selectors/items/properties/selector/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              var data3 = data2.action;
              if (data3 !== undefined) {
                var errs_3 = errors;
                if (typeof data3 !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.selectors[' + i1 + '].action',
                    schemaPath: '#/properties/selectors/items/properties/action/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var schema3 = validate.schema.properties.selectors.items.properties.action.enum;
                var valid3;
                valid3 = false;
                for (var i3 = 0; i3 < schema3.length; i3++)
                  if (equal(data3, schema3[i3])) {
                    valid3 = true;
                    break;
                  } if (!valid3) {
                  var err = {
                    keyword: 'enum',
                    dataPath: (dataPath || '') + '.selectors[' + i1 + '].action',
                    schemaPath: '#/properties/selectors/items/properties/action/enum',
                    params: {
                      allowedValues: schema3
                    },
                    message: 'should be equal to one of the allowed values'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.selectors[' + i1 + ']',
                schemaPath: '#/properties/selectors/items/type',
                params: {
                  type: 'object'
                },
                message: 'should be object'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.selectors',
            schemaPath: '#/properties/selectors/type',
            params: {
              type: 'array'
            },
            message: 'should be array'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.modifiers;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'modifiers'
          },
          message: 'should have required property \'modifiers\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
          if (data1[''] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: ''
              },
              message: 'should have required property \'\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['!'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '!'
              },
              message: 'should have required property \'!\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['@'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '@'
              },
              message: 'should have required property \'@\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['#'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '#'
              },
              message: 'should have required property \'#\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1.$ === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '$'
              },
              message: 'should have required property \'$\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['%'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '%'
              },
              message: 'should have required property \'%\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['^'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '^'
              },
              message: 'should have required property \'^\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['&'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '&'
              },
              message: 'should have required property \'&\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['*'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '*'
              },
              message: 'should have required property \'*\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1._ === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '_'
              },
              message: 'should have required property \'_\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['+'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '+'
              },
              message: 'should have required property \'+\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['-'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '-'
              },
              message: 'should have required property \'-\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['='] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '='
              },
              message: 'should have required property \'=\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['~'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '~'
              },
              message: 'should have required property \'~\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['"'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '"'
              },
              message: 'should have required property \'"\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1[';'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: ';'
              },
              message: 'should have required property \';\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1[':'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: ':'
              },
              message: 'should have required property \':\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['\\'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '\\'
              },
              message: 'should have required property \'\\\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['|'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '|'
              },
              message: 'should have required property \'|\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['/'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '/'
              },
              message: 'should have required property \'/\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['?'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '?'
              },
              message: 'should have required property \'?\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['.'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '.'
              },
              message: 'should have required property \'.\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['>'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '>'
              },
              message: 'should have required property \'>\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1['<'] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: '<'
              },
              message: 'should have required property \'<\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1[','] === undefined) {
            var err = {
              keyword: 'required',
              dataPath: (dataPath || '') + '.modifiers',
              schemaPath: '#/properties/modifiers/required',
              params: {
                missingProperty: ','
              },
              message: 'should have required property \',\''
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var errs__1 = errors;
          var valid2 = true;
          for (var key1 in data1) {
            var isAdditional1 = !(false || pattern1.test(key1));
            if (isAdditional1) {
              valid2 = false;
              var err = {
                keyword: 'additionalProperties',
                dataPath: (dataPath || '') + '.modifiers',
                schemaPath: '#/properties/modifiers/additionalProperties',
                params: {
                  additionalProperty: '' + key1 + ''
                },
                message: 'should NOT have additional properties'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          for (var key1 in data1) {
            if (pattern1.test(key1)) {
              var data2 = data1[key1];
              var errs_2 = errors;
              if (Array.isArray(data2)) {
                var errs__2 = errors;
                var valid2;
                for (var i2 = 0; i2 < data2.length; i2++) {
                  var data3 = data2[i2];
                  var errs_3 = errors;
                  if ((data3 && typeof data3 === "object" && !Array.isArray(data3))) {
                    var errs__3 = errors;
                    var valid4 = true;
                    for (var key3 in data3) {
                      var isAdditional3 = !(false || key3 == 'action' || key3 == 'args' || key3 == 'user_args');
                      if (isAdditional3) {
                        valid4 = false;
                        var err = {
                          keyword: 'additionalProperties',
                          dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + ']',
                          schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/items/additionalProperties',
                          params: {
                            additionalProperty: '' + key3 + ''
                          },
                          message: 'should NOT have additional properties'
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                    }
                    if (data3.action !== undefined) {
                      var errs_4 = errors;
                      var errs_5 = errors;
                      var schema5 = refVal1.enum;
                      var valid5;
                      valid5 = false;
                      for (var i5 = 0; i5 < schema5.length; i5++)
                        if (equal(data3.action, schema5[i5])) {
                          valid5 = true;
                          break;
                        } if (!valid5) {
                        var err = {
                          keyword: 'enum',
                          dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + '].action',
                          schemaPath: '/definitions/actions/enum',
                          params: {
                            allowedValues: schema5
                          },
                          message: 'should be equal to one of the allowed values'
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var valid5 = errors === errs_5;
                      var valid4 = errors === errs_4;
                    }
                    var data4 = data3.args;
                    if (data4 !== undefined) {
                      var errs_4 = errors;
                      if (Array.isArray(data4)) {
                        var errs__4 = errors;
                        var valid4;
                        for (var i4 = 0; i4 < data4.length; i4++) {
                          var errs_5 = errors;
                          if (typeof data4[i4] !== "string") {
                            var err = {
                              keyword: 'type',
                              dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + '].args[' + i4 + ']',
                              schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/items/properties/args/items/type',
                              params: {
                                type: 'string'
                              },
                              message: 'should be string'
                            };
                            if (vErrors === null) vErrors = [err];
                            else vErrors.push(err);
                            errors++;
                          }
                          var valid5 = errors === errs_5;
                        }
                      } else {
                        var err = {
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + '].args',
                          schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/items/properties/args/type',
                          params: {
                            type: 'array'
                          },
                          message: 'should be array'
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var valid4 = errors === errs_4;
                    }
                    var data4 = data3.user_args;
                    if (data4 !== undefined) {
                      var errs_4 = errors;
                      if (typeof data4 !== "string") {
                        var err = {
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + '].user_args',
                          schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/items/properties/user_args/type',
                          params: {
                            type: 'string'
                          },
                          message: 'should be string'
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var schema4 = validate.schema.properties.modifiers.patternProperties['^(!|@|#|\\$|%|\\^|&|\\*|_|\\+|-|=|~|\\"|;|:|\\\\|\\||/|\\?|\\.|>|<|,|[a-z0-9]+)?$'].items.properties.user_args.enum;
                      var valid4;
                      valid4 = false;
                      for (var i4 = 0; i4 < schema4.length; i4++)
                        if (equal(data4, schema4[i4])) {
                          valid4 = true;
                          break;
                        } if (!valid4) {
                        var err = {
                          keyword: 'enum',
                          dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + '].user_args',
                          schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/items/properties/user_args/enum',
                          params: {
                            allowedValues: schema4
                          },
                          message: 'should be equal to one of the allowed values'
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var valid4 = errors === errs_4;
                    }
                  } else {
                    var err = {
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\'][' + i2 + ']',
                      schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/items/type',
                      params: {
                        type: 'object'
                      },
                      message: 'should be object'
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid3 = errors === errs_3;
                }
              } else {
                var err = {
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.modifiers[\'' + key1 + '\']',
                  schemaPath: '#/properties/modifiers/patternProperties/%5E(!%7C%40%7C%23%7C%5C%24%7C%25%7C%5C%5E%7C%26%7C%5C*%7C_%7C%5C%2B%7C-%7C%3D%7C~0%7C%5C%22%7C%3B%7C%3A%7C%5C%5C%7C%5C%7C%7C~1%7C%5C%3F%7C%5C.%7C%3E%7C%3C%7C%2C%7C%5Ba-z0-9%5D%2B)%3F%24/type',
                  params: {
                    type: 'array'
                  },
                  message: 'should be array'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.modifiers',
            schemaPath: '#/properties/modifiers/type',
            params: {
              type: 'object'
            },
            message: 'should be object'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.autodetection;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'autodetection'
          },
          message: 'should have required property \'autodetection\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (Array.isArray(data1)) {
          var errs__1 = errors;
          var valid1;
          for (var i1 = 0; i1 < data1.length; i1++) {
            var data2 = data1[i1];
            var errs_2 = errors;
            if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
              var errs__2 = errors;
              var valid3 = true;
              if (data2.selector !== undefined) {
                var errs_3 = errors;
                if (typeof data2.selector !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.autodetection[' + i1 + '].selector',
                    schemaPath: '#/properties/autodetection/items/properties/selector/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.action !== undefined) {
                var errs_3 = errors;
                var errs_4 = errors;
                var schema4 = refVal[1].enum;
                var valid4;
                valid4 = false;
                for (var i4 = 0; i4 < schema4.length; i4++)
                  if (equal(data2.action, schema4[i4])) {
                    valid4 = true;
                    break;
                  } if (!valid4) {
                  var err = {
                    keyword: 'enum',
                    dataPath: (dataPath || '') + '.autodetection[' + i1 + '].action',
                    schemaPath: '/definitions/actions/enum',
                    params: {
                      allowedValues: schema4
                    },
                    message: 'should be equal to one of the allowed values'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid4 = errors === errs_4;
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.autodetection[' + i1 + ']',
                schemaPath: '#/properties/autodetection/items/type',
                params: {
                  type: 'object'
                },
                message: 'should be object'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.autodetection',
            schemaPath: '#/properties/autodetection/type',
            params: {
              type: 'array'
            },
            message: 'should be array'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.startup_preferences;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'startup_preferences'
          },
          message: 'should have required property \'startup_preferences\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (Array.isArray(data1)) {
          var errs__1 = errors;
          var valid1;
          for (var i1 = 0; i1 < data1.length; i1++) {
            var data2 = data1[i1];
            var errs_2 = errors;
            if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
              var errs__2 = errors;
              var valid3 = true;
              var data3 = data2.pattern;
              if (data3 !== undefined) {
                var errs_3 = errors;
                if ((data3 && typeof data3 === "object" && !Array.isArray(data3))) {
                  var errs__3 = errors;
                  var valid4 = true;
                  if (data3.type !== undefined) {
                    var errs_4 = errors;
                    if (typeof data3.type !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.startup_preferences[' + i1 + '].pattern.type',
                        schemaPath: '#/properties/startup_preferences/items/properties/pattern/properties/type/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid4 = errors === errs_4;
                  }
                  if (data3.value !== undefined) {
                    var errs_4 = errors;
                    if (typeof data3.value !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.startup_preferences[' + i1 + '].pattern.value',
                        schemaPath: '#/properties/startup_preferences/items/properties/pattern/properties/value/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid4 = errors === errs_4;
                  }
                } else {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.startup_preferences[' + i1 + '].pattern',
                    schemaPath: '#/properties/startup_preferences/items/properties/pattern/type',
                    params: {
                      type: 'object'
                    },
                    message: 'should be object'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.action !== undefined) {
                var errs_3 = errors;
                if (typeof data2.action !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.startup_preferences[' + i1 + '].action',
                    schemaPath: '#/properties/startup_preferences/items/properties/action/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data2.value !== undefined) {
                var errs_3 = errors;
                if (typeof data2.value !== "string") {
                  var err = {
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.startup_preferences[' + i1 + '].value',
                    schemaPath: '#/properties/startup_preferences/items/properties/value/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.startup_preferences[' + i1 + ']',
                schemaPath: '#/properties/startup_preferences/items/type',
                params: {
                  type: 'object'
                },
                message: 'should be object'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.startup_preferences',
            schemaPath: '#/properties/startup_preferences/type',
            params: {
              type: 'array'
            },
            message: 'should be array'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.keymap;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'keymap'
          },
          message: 'should have required property \'keymap\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
          var errs__1 = errors;
          var valid2 = true;
          for (var key1 in data1) {
            if (pattern2.test(key1)) {
              var errs_2 = errors;
              if (typeof data1[key1] !== "string") {
                var err = {
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.keymap[\'' + key1 + '\']',
                  schemaPath: '#/properties/keymap/patternProperties/%5E.*%24/type',
                  params: {
                    type: 'string'
                  },
                  message: 'should be string'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.keymap',
            schemaPath: '#/properties/keymap/type',
            params: {
              type: 'object'
            },
            message: 'should be object'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.keymap_preferences;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'keymap_preferences'
          },
          message: 'should have required property \'keymap_preferences\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (Array.isArray(data1)) {
          var errs__1 = errors;
          var valid1;
          for (var i1 = 0; i1 < data1.length; i1++) {
            var errs_2 = errors;
            if (typeof data1[i1] !== "string") {
              var err = {
                keyword: 'type',
                dataPath: (dataPath || '') + '.keymap_preferences[' + i1 + ']',
                schemaPath: '#/properties/keymap_preferences/items/type',
                params: {
                  type: 'string'
                },
                message: 'should be string'
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.keymap_preferences',
            schemaPath: '#/properties/keymap_preferences/type',
            params: {
              type: 'array'
            },
            message: 'should be array'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      if (data.autoclose_quotes === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'autoclose_quotes'
          },
          message: 'should have required property \'autoclose_quotes\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data.autoclose_quotes !== "boolean") {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.autoclose_quotes',
            schemaPath: '#/properties/autoclose_quotes/type',
            params: {
              type: 'boolean'
            },
            message: 'should be boolean'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      if (data.autoclose_brackets === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'autoclose_brackets'
          },
          message: 'should have required property \'autoclose_brackets\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data.autoclose_brackets !== "boolean") {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.autoclose_brackets',
            schemaPath: '#/properties/autoclose_brackets/type',
            params: {
              type: 'boolean'
            },
            message: 'should be boolean'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      if (data.input_top === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'input_top'
          },
          message: 'should have required property \'input_top\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data.input_top !== "boolean") {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.input_top',
            schemaPath: '#/properties/input_top/type',
            params: {
              type: 'boolean'
            },
            message: 'should be boolean'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.input_style;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'input_style'
          },
          message: 'should have required property \'input_style\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
          var errs__1 = errors;
          var valid2 = true;
          for (var key1 in data1) {
            if (pattern2.test(key1)) {
              var errs_2 = errors;
              if (typeof data1[key1] !== "string") {
                var err = {
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.input_style[\'' + key1 + '\']',
                  schemaPath: '#/properties/input_style/patternProperties/%5E.*%24/type',
                  params: {
                    type: 'string'
                  },
                  message: 'should be string'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.input_style',
            schemaPath: '#/properties/input_style/type',
            params: {
              type: 'object'
            },
            message: 'should be object'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      var data1 = data.input_container_style;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: 'required',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/required',
          params: {
            missingProperty: 'input_container_style'
          },
          message: 'should have required property \'input_container_style\''
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
          var errs__1 = errors;
          var valid2 = true;
          for (var key1 in data1) {
            if (pattern2.test(key1)) {
              var errs_2 = errors;
              if (typeof data1[key1] !== "string") {
                var err = {
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.input_container_style[\'' + key1 + '\']',
                  schemaPath: '#/properties/input_container_style/patternProperties/%5E.*%24/type',
                  params: {
                    type: 'string'
                  },
                  message: 'should be string'
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
            }
          }
        } else {
          var err = {
            keyword: 'type',
            dataPath: (dataPath || '') + '.input_container_style',
            schemaPath: '#/properties/input_container_style/type',
            params: {
              type: 'object'
            },
            message: 'should be object'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
    } else {
      var err = {
        keyword: 'type',
        dataPath: (dataPath || '') + "",
        schemaPath: '#/type',
        params: {
          type: 'object'
        },
        message: 'should be object'
      };
      if (vErrors === null) vErrors = [err];
      else vErrors.push(err);
      errors++;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  "type": "object",
  "required": ["version", "labels", "hotkeys", "selectors", "modifiers", "autodetection", "startup_preferences", "keymap", "keymap_preferences", "autoclose_quotes", "autoclose_brackets", "input_top", "input_style", "input_container_style"],
  "definitions": {
    "actions": {
      "$id": "/definitions/actions",
      "$comment": "List of actions from actions.js; to update use Object.keys(require('./src/actions'))",
      "enum": ["autodetect", "show_help", "click", "open_in_new_tab", "open_in_this_tab", "remove", "focus", "trigger_events", "set_value", "download", "copy_contents", "toggle_pause", "mute"]
    }
  },
  "additionalProperties": false,
  "properties": {
    "version": {
      "$id": "/properties/version",
      "type": "number",
      "minimum": 1,
      "maximum": 1
    },
    "labels": {
      "$id": "/properties/labels",
      "type": "object",
      "additionalProperties": false,
      "required": ["alphabet", "font", "on_scroll", "exit_on_resize", "padding", "blink_interval", "stroke_styles", "fill_color", "text_color"],
      "properties": {
        "alphabet": {
          "$id": "/properties/labels/properties/alphabet",
          "type": "string",
          "title": "alphabet ",
          "pattern": "^[a-z0-9]+$",
          "default": "abcdefghijklmnopqrstuvwxyz0123456789",
          "minLength": 1,
          "examples": ["12px monospace"]
        },
        "font": {
          "$id": "/properties/labels/properties/font",
          "type": "string",
          "title": "The Font_family Schema ",
          "default": "monospace",
          "examples": ["12px monospace"]
        },
        "on_scroll": {
          "type": "string",
          "enum": ["prevent", "exit", "restore"]
        },
        "exit_on_resize": {
          "type": "boolean",
          "default": false
        },
        "padding": {
          "$id": "/properties/labels/properties/padding",
          "type": "array",
          "title": "The Padding Schema",
          "default": [4, 3, 5, 3],
          "minItems": 4,
          "maxItems": 4,
          "items": {
            "type": "integer",
            "minimum": 0
          }
        },
        "blink_interval": {
          "$id": "/properties/labels/properties/blink_interval",
          "type": "integer",
          "title": "The Blink_interval Schema ",
          "default": 600,
          "minimum": 16,
          "examples": [600]
        },
        "stroke_styles": {
          "$id": "/properties/labels/properties/stroke_tags_colors",
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "selector": {
                "type": "string"
              },
              "style": {
                "type": "string"
              }
            }
          }
        },
        "fill_color": {
          "$id": "/properties/labels/properties/fill_color",
          "type": "string",
          "title": "The Fill_color Schema ",
          "default": "yellow",
          "examples": ["yellow"]
        },
        "text_color": {
          "$id": "/properties/labels/properties/text_color",
          "type": "string",
          "title": "The Text_color Schema ",
          "default": "",
          "examples": ["#500"]
        }
      }
    },
    "hotkeys": {
      "$id": "/properties/hotkeys",
      "type": "array",
      "items": {
        "$id": "/properties/hotkeys/items",
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "binding": {
            "$id": "/properties/hotkeys/items/properties/binding",
            "type": "string",
            "title": "The Binding Schema ",
            "default": "",
            "examples": ["ctrl+e"]
          },
          "action": {
            "$id": "/properties/hotkeys/items/properties/action",
            "type": "string",
            "title": "The Action Schema ",
            "enum": ["start-input", "start-instant", "clear-messages", "leave-focus", "turn-off", "turn-off-page", "turn-off-domain", "show-help"],
            "examples": ["leave-focus"]
          },
          "global": {
            "$id": "/properties/hotkeys/items/properties/global",
            "type": "boolean",
            "title": "The Global Schema ",
            "default": false,
            "examples": [true]
          },
          "preventDefault": {
            "$id": "/properties/hotkeys/items/properties/preventDefaultxs",
            "type": "boolean",
            "$comment": "Prevent default action (e.g. typing)",
            "default": false,
            "examples": [true]
          },
          "value": {
            "$id": "/properties/hotkeys/items/properties/value",
            "type": "string",
            "title": "The Value Schema ",
            "default": "",
            "examples": [""]
          }
        }
      }
    },
    "message_timeout": {
      "$id": "/properties/message_timeout",
      "$comment": "message timeout in ms., 0 = no timeout",
      "type": "integer",
      "title": "The Message_timeout Schema ",
      "default": 7000,
      "examples": [7000]
    },
    "selectors": {
      "$id": "/properties/selectors",
      "type": "array",
      "items": {
        "$id": "/properties/selectors/items",
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "pattern": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "type": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            }
          },
          "selector": {
            "type": "string"
          },
          "action": {
            "type": "string",
            "enum": ["exclude", "include", "add", "set"]
          }
        }
      }
    },
    "modifiers": {
      "$id": "/properties/modifiers",
      "type": "object",
      "additionalProperties": false,
      "required": ["", "!", "@", "#", "$", "%", "^", "&", "*", "_", "+", "-", "=", "~", "\"", ";", ":", "\\", "|", "/", "?", ".", ">", "<", ","],
      "patternProperties": {
        "^(!|@|#|\\$|%|\\^|&|\\*|_|\\+|-|=|~|\\\"|;|:|\\\\|\\||/|\\?|\\.|>|<|,|[a-z0-9]+)?$": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "action": {
                "$ref": "/definitions/actions"
              },
              "args": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "user_args": {
                "type": "string",
                "enum": ["ignore", "accept", "append", "prepend", "warn", "error"]
              }
            }
          }
        }
      }
    },
    "autodetection": {
      "$id": "/properties/autodetection",
      "type": "array",
      "items": {
        "$id": "/properties/autodetection/items",
        "type": "object",
        "properties": {
          "selector": {
            "$id": "/properties/autodetection/items/properties/selector",
            "type": "string",
            "title": "The Selector Schema ",
            "default": "",
            "examples": ["a[target=_blank]"]
          },
          "action": {
            "$ref": "/definitions/actions"
          }
        }
      }
    },
    "startup_preferences": {
      "$id": "/properties/startup_preferences",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "pattern": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "value": {
                "type": "string"
              }
            }
          },
          "action": {
            "type": "string"
          },
          "value": {
            "type": "string"
          }
        }
      }
    },
    "keymap": {
      "type": "object",
      "patternProperties": {
        "^.*$": {
          "type": "string"
        }
      }
    },
    "keymap_preferences": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "autoclose_quotes": {
      "type": "boolean"
    },
    "autoclose_brackets": {
      "type": "boolean"
    },
    "input_top": {
      "type": "boolean"
    },
    "input_style": {
      "type": "object",
      "patternProperties": {
        "^.*$": {
          "type": "string"
        }
      }
    },
    "input_container_style": {
      "type": "object",
      "patternProperties": {
        "^.*$": {
          "type": "string"
        }
      }
    }
  }
};
validate.errors = null;
module.exports = validate;