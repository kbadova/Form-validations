import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import SelectField from '../SelectField';
import InputField from '../InputField';

import './styles.css';

class BookingRequestForm extends React.Component {
  constructor(props) {
    super(props);

    this.initialFields = {
      name: {
        value: '',
        errors: []
      },
      email: {
        value: '',
        errors: []
      },
      start: {
        value: '',
        errors: []
      },
      end: {
        value: '',
        errors: []
      },
      roomType: {
        value: '',
        errors: []
      },
      meal: {
        value: '',
        errors: []
      },
      phone: {
        value: '',
        errors: []
      }
    };
    this.state = {
      form: {
        fields: {
          ...this.initialFields
        }
      },
      roomTypes: [],
      errorMessage: '',
      successMessage: '',
      meals: []
    };
  }

  componentDidMount() {
    const url = 'http://localhost:8000/booking/room-types/';
    axios.get(url).then(response => {
      const roomTypes = response.data;

      this.setState({roomTypes});
    });

    const mealsUrl = 'http://localhost:8000/booking/meals/';
    axios.get(mealsUrl).then(response => {
      const meals = response.data;

      this.setState({meals});
    });
  }

  updateState = (path, value) => {
    const newState = _.cloneDeep(this.state);
    const stateWithChangedField = _.set(newState, path, value);

    this.setState(stateWithChangedField);
  };

  getFieldValue = path => _.get(this.state, path);

  setFieldErrors = responseData => {
    let form = _.cloneDeep(this.state.form);
    _.forEach(responseData, (value, key) => {
      _.set(form, `fields.${key}.errors`, value);
    });

    this.setState({form});
  };

  handleNameChange = event => {
    const nameValue = event.target.value;
    const {form} = this.state;
    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          name: {
            ...form.fields.name,
            value: nameValue
          }
        }
      }
    });
  };

  handleEmailChange = event => {
    const emailValue = event.target.value;
    const {form} = this.state;
    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          email: {
            ...form.fields.email,
            value: emailValue
          }
        }
      }
    });
  };

  handleStartChange = event => {
    const startValue = event.target.value;
    const {form} = this.state;
    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          start: {
            ...form.fields.start,
            value: startValue
          }
        }
      }
    });
  };

  handleEndChange = event => {
    const endValue = event.target.value;
    const {form} = this.state;
    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          end: {
            ...form.fields.end,
            value: endValue
          }
        }
      }
    });
  };

  handleRoomTypeChange = event => {
    const value = event.target.value;
    const {form} = this.state;
    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          roomType: {
            ...form.fields.roomType,
            value: value
          }
        }
      }
    });
  };

  handleSubmit = () => {
    const {
      form: {
        fields: {name, email, start, end, roomType}
      }
    } = this.state;

    const url = 'http://localhost:8000/booking/booking-request/';
    const payload = {
      name: name.value,
      email: email.value,
      start: start.value,
      end: end.value,
      roomType: roomType.value
    };

    axios
      .post(url, payload)
      .then(response => {
        // TODO: Clear all field and non field errors

        this.setState({successMessage: 'Booking request submitted'});
      })
      .catch(errors => {
        const errorResponse = errors.response.data;
        const newKeys = {};
        const {
          form: {fields}
        } = this.state;
        _.mapKeys(errorResponse, (error, key) => {
          newKeys[key] = {
            ...fields[key],
            errors: error
          };
        });

        this.setState({
          form: {
            fields: {
              ...fields,
              ...newKeys
            }
          }
        });
      });
  };

  handleClear = () => {
    this.setState({
      form: {
        ...this.state.form,
        fields: this.initialFields
      }
    });
  };

  handleMealsChange = event => {
    const value = event.target.value;
    const {form} = this.state;
    this.setState({
      form: {
        ...form,
        fields: {
          ...form.fields,
          meal: {
            ...form.fields.meal,
            value: value
          }
        }
      }
    });
  };

  handlePhoneChange = event => {
    this.updateState('form.fields.phone.value', event.target.value);
  };

  render() {
    const {
      errorMessage,
      successMessage,
      form: {
        fields: {name, email, start, end}
      },
      roomTypes,
      meals
    } = this.state;

    return (
      <div>
        {errorMessage && <div>{errorMessage}</div>}
        {successMessage && <div>{successMessage}</div>}

        <form className="BookingRequestForm">
          <div className="nameAndEmail">
            <InputField
              label="Name"
              type="text"
              value={name.value}
              onChange={this.handleNameChange}
              errors={name.errors}
            />

            <InputField
              label="Email"
              type="email"
              value={email.value}
              onChange={this.handleEmailChange}
              errors={email.errors}
            />
          </div>
          <div className="dates">
            <InputField
              label="Start"
              type="date"
              value={start.value}
              onChange={this.handleStartChange}
              errors={start.errors}
            />
            <InputField
              label="End"
              type="date"
              value={end.value}
              onChange={this.handleEndChange}
              errors={end.errors}
            />
          </div>

          <SelectField
            label="Room Type"
            onChange={this.handleRoomTypeChange}
            options={roomTypes}
          />

          <SelectField
            label="Meals"
            onChange={this.handleMealsChange}
            options={meals}
          />

          <InputField
            type="text"
            label="Phone number"
            value={phone.value}
            onChange={this.handlePhoneChange}
            errors={phone.errors}
          />

          <button type="button" onClick={this.handleSubmit}>
            Request Booking
          </button>

          <button type="button" onClick={this.handleClear}>
            Clear
          </button>
        </form>
      </div>
    );
  }
}

export default BookingRequestForm;
