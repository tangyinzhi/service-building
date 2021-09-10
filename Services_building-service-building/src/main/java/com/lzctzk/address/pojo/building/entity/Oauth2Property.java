package com.lzctzk.address.pojo.building.entity;

import org.springframework.stereotype.Component;

@Component
public class Oauth2Property {
    private String clientId = "568b297eb5ec416fa62f5052b9bfb831";
    private String clientSecret = "A60B263B2A1F1BC189D0C3248ABAE63A";
    private String authorizeUrl = "http://192.168.20.245:80/oauth/authorize";
    private String redirectUrl = "http://localhost:8893/login";
    private String accessTokenUrl = "http://192.168.20.245:80/oauth/token";
    private String userInfoUrl = "http://192.168.20.245:80/oauth/api/user";

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getAuthorizeUrl() {
        return authorizeUrl;
    }

    public void setAuthorizeUrl(String authorizeUrl) {
        this.authorizeUrl = authorizeUrl;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getAccessTokenUrl() {
        return accessTokenUrl;
    }

    public void setAccessTokenUrl(String accessTokenUrl) {
        this.accessTokenUrl = accessTokenUrl;
    }

    public String getUserInfoUrl() {
        return userInfoUrl;
    }

    public void setUserInfoUrl(String userInfoUrl) {
        this.userInfoUrl = userInfoUrl;
    }
}
