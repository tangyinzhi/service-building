package com.lzctzk.address.config.aop;/**
 * com.lzctzk.address.pojo.parking.config
 *
 * @author luozhen
 * @date 2018-11-24 13:55
 * @version V1.0
 * @description
 */

import com.lzctzk.address.util.IP.IpUtil;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * com.lzctzk.address.pojo.parking.config
 *
 * @author luozhen
 * @version V1.0
 * @date 2018-11-24 13:55
 * @description
 */
@Aspect
@Component
public class AOPConfig {

    private static Logger log = LoggerFactory.getLogger(AOPConfig.class);

    public static long startTime;
    public static long endTime;

    /*@PointCut注解表示表示横切点，哪些方法需要被横切*/
    /*切点表达式*/
    @Pointcut("execution(* com.lzctzk.address.pojo.*.controller.*.*(..))")
    /*切点签名*/
    public void print() {

    }

    /**
     * @Before注解表示在具体的方法之前执行
     */
    @Before("print()")
    public void before(JoinPoint joinPoint) {
        log.info("前置切面before……");
        startTime = System.currentTimeMillis();
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = requestAttributes.getRequest();
        String requestURI = request.getRequestURI();
        //这个方法取客户端ip"不够好"
        //String remoteAddr = request.getRemoteAddr();
        String remoteAddr = IpUtil.getIpAddr();
        String requestMethod = request.getMethod();
        String declaringTypeName = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.info("请求的url:{}", requestURI);
        log.info("请求的客户端ip:{}", remoteAddr);
        log.info("请求方式:{}", requestMethod);
        log.info("请求的类名:{}", declaringTypeName);
        log.info("请求的方法名:{}", methodName);
        log.info("请求的入参:{}", args);
    }

    /*@After注解表示在方法执行之后执行*/
    @After("print()")
    public void after() {
        endTime = System.currentTimeMillis() - startTime;
        log.info("后置切面after……");
    }

    /*@AfterReturning注解用于获取方法的返回值*/
    @AfterReturning(pointcut = "print()", returning = "object")
    public void getAfterReturn(Object object) {
        log.info("本次接口耗时={}ms", endTime);
        log.info("response={}", object.toString());
    }

}
