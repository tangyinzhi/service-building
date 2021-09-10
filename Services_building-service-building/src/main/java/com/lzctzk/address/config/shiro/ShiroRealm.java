package com.lzctzk.address.config.shiro;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lzctzk.address.dao.building.entity.BtPermission;
import com.lzctzk.address.dao.building.entity.BtUser;
import com.lzctzk.address.dao.building.mapper.BtUserMapper;
import com.lzctzk.address.dao.building.service.IBtUserService;
import com.lzctzk.address.pojo.building.entity.MyProps;
import com.lzctzk.address.pojo.building.mapper.CustomMapper;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ShiroRealm extends AuthorizingRealm {


    @Autowired
    private IBtUserService iBtUserService;
    @Autowired
    private BtUserMapper btUserMapper;

    @Autowired
    private CustomMapper customMapper;

    @Autowired
    MyProps myProps;

    //用户认证
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        // 取出表单用户名
        //获取用户的输入的账号.
        String username = token.getCredentials().toString();
        String usernameY = ((UsernamePasswordToken) token).getUsername();
        String password = new String((char[]) token.getCredentials());


        String md5Pwd = new Md5Hash(password, username).toHex();

        //通过username从数据库中查找 User对象，如果找到，没找到.
        QueryWrapper<BtUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(BtUser::getName, usernameY);
        BtUser userTrue = btUserMapper.selectOne(queryWrapper);
        if (userTrue == null) {
            return null;
        }
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                userTrue, //用户名
                md5Pwd, //密码
                ByteSource.Util.bytes(username),//salt=username+salt
                getName()  //realm name
        );
        Session session = SecurityUtils.getSubject().getSession();
        session.setAttribute("user", userTrue);
        session.setAttribute("userId", userTrue.getId());
        session.setAttribute("userName", userTrue.getName());
        return authenticationInfo;

    }

    //角色权限和对应权限添加
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        // 1. 从 PrincipalCollection 中来获取登录用户的信息
        Object principal = principals.getPrimaryPrincipal();
        // 2. 利用登录的用户的信息来..当前用户的角色或权限(可能需要查询数据库)
        Set<String> roles = new HashSet<String>();
        roles.add("user");
        if ("admin".equals(principal)) {
            roles.add("admin");
        }
        Session session = SecurityUtils.getSubject().getSession();
        String userId = session.getAttribute("userId").toString();
        String systemId = myProps.getSystemid();
        List<BtPermission> list = customMapper.getPermission(userId, systemId);
        // 权限信息对象info,用来存放查出的用户的所有的角色（role）及权限（permission）
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        if (list.size() > 0) {
            for (BtPermission btPermission : list) {
                info.addStringPermission(btPermission.getPermissionString());
            }
        }

        // 4. 返回 SimpleAuthorizationInfo 对象.
        return info;
    }
}