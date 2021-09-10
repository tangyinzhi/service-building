package com.lzctzk.address.pojo.building.servcie;


import com.lzctzk.address.dao.building.entity.BtDataAuth;
import com.lzctzk.address.dao.building.service.IBtDataAuthService;
import com.lzctzk.address.pojo.building.mapper.DataAuthMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.jackson.JsonUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author luozhen
 * @since 2019-02-27
 */
@Service
public class DataAuthService {

    private static final Logger log = LoggerFactory.getLogger(BuildingService.class);
    @Autowired
    DataAuthMapper dataAuthMapper;

    /**
     * 查询总记录数
     *
     * @return
     */
    public Long selectCount() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());

        return dataAuthMapper.selectCount();
    }

    /**
     * 查询最大ID
     *
     * @return
     */
    public Long selectMaxID() {
        log.info("进入==>服务：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        return dataAuthMapper.selectMaxID();
    }
}
