package com.lzctzk.address.pojo.building.controller;

import com.alibaba.fastjson.JSONObject;
import com.lzctzk.address.pojo.building.entity.Oauth2Property;
import io.swagger.annotations.Api;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpSession;

@Api(tags = "登录页面控制器")
@Controller
@RequestMapping("/")
public class MainController {
    private static final Logger log = LoggerFactory.getLogger(LogController.class);
    private final Oauth2Property oauth2Property;

    public MainController(Oauth2Property oauth2Property) {
        this.oauth2Property = oauth2Property;
    }

    @GetMapping("/")
    public String index() {

        return "index.html";
    }

    @GetMapping("/login.html")
    public String login() {

        return "login.html";
    }

    @GetMapping("/login")
    public String login1(@RequestParam("code") String code) {
        log.info("code={}",code);
        String accessToken = getAccessToken(code);
        String userInfo = getUserInfo(accessToken);
        log.info("重定向到首页");
        return "login.html";
    }
    @GetMapping("/dologin")
    public String dologin(){
        String redirect_uri = java.net.URLEncoder.encode(oauth2Property.getRedirectUrl());
        String url = oauth2Property.getAuthorizeUrl() +
                "?client_id=" + oauth2Property.getClientId() +
                "&redirect_uri=" + redirect_uri +
                "&response_type=code"+
                "&scope=read,write,trust"+
                "&state=demo";
        log.info("授权url:{}",url);
        return "redirect:" + url;
    }

    private String getAccessToken(String code){
        String url = oauth2Property.getAccessTokenUrl() +
                "?grant_type=authorization_code"+
                "&code="+code+
                "&client_id=" + oauth2Property.getClientId() +
                "&client_secret=" + oauth2Property.getClientSecret() +
                "&redirect_uri=" + oauth2Property.getRedirectUrl();
        /*Map<String ,String> map = new HashMap<String, String>();
        map.put("grant_type","authorization_code");
        map.put("code",code);
        map.put("client_id",oauth2Property.getClientId());
        map.put("client_secret",oauth2Property.getClientSecret());
        map.put("redirect_uri",redirect_uri);*/
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("accept","application/json");
//        requestHeaders.setContentType(MediaType.parseMediaType("application/x-www-form-urlencoded"));
        HttpEntity<String> requestentity = new HttpEntity<String>(requestHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(url,requestentity,String.class);
        String responseStr = response.getBody();
        log.info("responseStr={}",responseStr);
        JSONObject jsonObject = JSONObject.parseObject(responseStr);
        String accessToken = jsonObject.getString("access_token");
        log.info("access_token={}",accessToken);
        return accessToken;
    }
    private String getUserInfo(String accessToken){
        String url = oauth2Property.getUserInfoUrl()+
                "?access_token="+accessToken;
        log.info("getUserInfo url:{}",url);
        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.add("accept","application/json");
//        requestHeaders.add("Authorization","token "+accessToken);
        HttpEntity<String> requestEntity = new HttpEntity<String>(requestHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity,String.class);
        String userInfo = response.getBody();
        log.info("userInfo:{}",userInfo);
        return userInfo;
    }

    @GetMapping("/index.html")
    public String indexH() {

        return "index.html";
    }

    @GetMapping("/unauthorized")
    public String unauthorized() {

        return "unauthorized.html";
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "welcome.html";
    }

    @GetMapping("/Indexiframe.html")
    public String Indexiframe() {
        return "Indexiframe.html";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        Subject subject = SecurityUtils.getSubject();
        subject.logout();
        return "/login";
    }

    @GetMapping("/earth.html")
    public String earth() {

        return "earth.html";
    }
}
