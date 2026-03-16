package com.vetcare.security;

import com.vetcare.entity.User;
import com.vetcare.enums.AuthProvider;
import com.vetcare.enums.Role;
import com.vetcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        OAuth2UserInfo userInfo = switch (registrationId.toLowerCase()) {
            case "google" -> new GoogleOAuth2UserInfo(attributes);
            case "facebook" -> new FacebookOAuth2UserInfo(attributes);
            default -> throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        };

        processOAuth2User(registrationId, userInfo);

        String nameAttributeKey = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        return new DefaultOAuth2User(
                oAuth2User.getAuthorities(),
                attributes,
                nameAttributeKey
        );
    }

    private User processOAuth2User(String registrationId, OAuth2UserInfo userInfo) {
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setFullName(userInfo.getName());
            if (user.getAvatarUrl() == null) {
                user.setAvatarUrl(userInfo.getImageUrl());
            }
            return userRepository.save(user);
        } else {
            User newUser = User.builder()
                    .email(userInfo.getEmail())
                    .fullName(userInfo.getName())
                    .avatarUrl(userInfo.getImageUrl())
                    .role(Role.USER)
                    .provider(AuthProvider.valueOf(registrationId.toUpperCase()))
                    .providerId(userInfo.getId())
                    .emailVerified(true)
                    .active(true)
                    .build();
            return userRepository.save(newUser);
        }
    }
}
