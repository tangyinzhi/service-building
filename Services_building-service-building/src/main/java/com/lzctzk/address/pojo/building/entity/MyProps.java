package com.lzctzk.address.pojo.building.entity;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

//自己配置的属性
@Component
@ConfigurationProperties(prefix = "myprops") //接收application.yml中的myProps下面的属性
public class MyProps {
    private String simpleprop;
    private String systemid;

    public String getSimpleProp() {
        return simpleprop;
    }

    //String类型的一定需要setter来接收属性值；maps, collections, 和 arrays 不需要
    public void setSimpleProp(String simpleProp) {
        this.simpleprop = simpleProp;
    }

    public String getSystemid() {
        return systemid;
    }

    //String类型的一定需要setter来接收属性值；maps, collections, 和 arrays 不需要
    public void setSystemid(String systemid) {
        this.systemid = systemid;
    }
}
