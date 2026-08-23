package com.rajcic.dto.request;

public class UpdateLocationRequest {

    private final String cityId;
    private final String street;
    private final String streetNumber;
    private final String additionalInfo;

    public UpdateLocationRequest(
            String cityId,
            String street,
            String streetNumber,
            String additionalInfo
    ) {
        this.cityId = cityId;
        this.street = street;
        this.streetNumber = streetNumber;
        this.additionalInfo = additionalInfo;
    }

    public String getCityId() {
        return cityId;
    }

    public String getStreet() {
        return street;
    }

    public String getStreetNumber() {
        return streetNumber;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }
}