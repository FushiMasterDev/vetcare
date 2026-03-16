package com.vetcare.security;

import java.util.Map;

public abstract class OAuth2UserInfo {
    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public abstract String getId();
    public abstract String getName();
    public abstract String getEmail();
    public abstract String getImageUrl();
}

class GoogleOAuth2UserInfo extends OAuth2UserInfo {
    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override public String getId() { return (String) attributes.get("sub"); }
    @Override public String getName() { return (String) attributes.get("name"); }
    @Override public String getEmail() { return (String) attributes.get("email"); }
    @Override public String getImageUrl() { return (String) attributes.get("picture"); }
}

class FacebookOAuth2UserInfo extends OAuth2UserInfo {
    public FacebookOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override public String getId() { return (String) attributes.get("id"); }
    @Override public String getName() { return (String) attributes.get("name"); }
    @Override public String getEmail() { return (String) attributes.get("email"); }
    @Override public String getImageUrl() {
        if (attributes.containsKey("picture")) {
            Map<String, Object> picture = (Map<String, Object>) attributes.get("picture");
            Map<String, Object> data = (Map<String, Object>) picture.get("data");
            return (String) data.get("url");
        }
        return null;
    }
}
