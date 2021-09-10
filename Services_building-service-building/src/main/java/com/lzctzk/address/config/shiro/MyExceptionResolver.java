package com.lzctzk.address.config.shiro;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

public class MyExceptionResolver implements HandlerExceptionResolver {

    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response, Object handler, Exception ex) {
        // TODO Auto-generated method stub
        System.out.println("==============异常开始=============");
        //如果是shiro无权操作，因为shiro 在操作auno等一部分不进行转发至无权限url
        if (ex instanceof UnauthorizedException) {
            ModelAndView mv = new ModelAndView("unauthorized");
            return mv;
        }
        ex.printStackTrace();
        ModelAndView mv = new ModelAndView("unauthorized");
        mv.addObject("exception", ex.toString().replaceAll("\n", "<br/>"));
        return mv;
    }
}
