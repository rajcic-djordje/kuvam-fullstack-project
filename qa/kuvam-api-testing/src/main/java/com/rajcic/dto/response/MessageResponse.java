package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MessageResponse {

     @JsonProperty("message")
     private String message;

     public MessageResponse() {}

     public MessageResponse(String message) {

         this.message = message;
     }

     public String getMessage() {

         return this.message;
     }


}
