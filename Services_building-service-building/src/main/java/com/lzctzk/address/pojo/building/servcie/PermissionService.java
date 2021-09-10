package com.lzctzk.address.pojo.building.servcie;


import com.lzctzk.address.dao.building.entity.BtPermission;
import com.lzctzk.address.pojo.building.mapper.CustomMapper;
import com.lzctzk.address.pojo.building.mapper.PermissionMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author dengjie
 * @since 2019-02-27
 */
@Service
public class PermissionService {

    private static final Logger log = LoggerFactory.getLogger(BuildingService.class);

    @Autowired
    private PermissionMapper permissionMapper;

    /**
     * 查询总记录数
     *
     * @return
     */
    public Long selectCount() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());

        return permissionMapper.selectCount();
    }

    /**
     * 查询最大ID
     *
     * @return
     */
    public Long selectMaxID() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return permissionMapper.selectMaxID();
    }

}
