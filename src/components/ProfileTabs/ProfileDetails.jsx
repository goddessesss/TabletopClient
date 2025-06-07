import React, { useEffect, useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";

function ProfileDetails({
  formData,
  setFormData,
  countries,
  loadingCountries,
  onInputChange,
  onSubmit,
  onCitySearch,
}) {
  const [cityOptions, setCityOptions] = useState([]);

  const loadCityOptions = async (inputValue) => {
    if (!formData.countryCode || inputValue.length < 2) return [];

    const cities = await onCitySearch(formData.countryCode, inputValue);

    const options = cities.map((city) => ({
      value: city.id,
      label: city.name,
      countryCode: city.countryCode,
    }));

    setCityOptions(options);
    return options;
  };

  const debouncedLoadCityOptions = useCallback(
    debounce((inputValue, resolve) => {
      loadCityOptions(inputValue).then(resolve);
    }, 500),
    [formData.countryCode]
  );
  useEffect(() => {
    return () => {
      debouncedLoadCityOptions.cancel();
    };
  }, [debouncedLoadCityOptions]);

  useEffect(() => {
    if (!formData.countryCode && formData.countryId && countries.length > 0) {
      const selected = countries.find((c) => c.id === formData.countryId);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          countryCode: selected.code,
        }));
      }
    }
  }, [formData.countryId, countries]);

  return (
     <div>
       <div className="mb-4">
        <h2 className="fw-bold text-dark">Profile Details</h2>
        <hr className="mb-4" />
      </div>
      
    <form onSubmit={onSubmit}>
      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">First Name</label>
        <input
          id="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">Last Name</label>
        <input
          id="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="nickname" className="form-label">Nickname</label>
        <input
          id="nickname"
          value={formData.nickname}
          onChange={onInputChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="bio" className="form-label">Bio</label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={onInputChange}
          className="form-control"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Country</label>
          <select
            id="country"
            className="form-select"
            value={formData.countryId || ""}
            onChange={(e) => {
              const selected = countries.find(
                (c) => c.id === parseInt(e.target.value)
              );
              if (selected) {
                setFormData((prev) => ({
                  ...prev,
                  countryId: selected.id,
                  country: selected.name,
                  countryCode: selected.code,
                  cityId: null,
                  cityName: "",
                }));
              }
            }}
          >
            <option value="" disabled>Select a country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">City</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={(inputValue) =>
              new Promise((resolve) => {
                debouncedLoadCityOptions(inputValue, resolve);
              })
            }
            value={
              formData.cityId
                ? { value: formData.cityId, label: formData.cityName }
                : null
            }
            onChange={(selected) => {
              setFormData((prev) => ({
                ...prev,
                cityId: selected?.value || null,
                cityName: selected?.label || "",
                countryCode: selected?.countryCode || prev.countryCode,
              }));
            }}
            placeholder="Start typing to search..."
            isClearable
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary">Save</button>
    </form>
  </div>

  );
}

export default ProfileDetails;
