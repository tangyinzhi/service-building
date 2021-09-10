package com.lzctzk.address.pojo.building.servcie;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lzctzk.address.dao.building.entity.BtLog;
import com.lzctzk.address.dao.building.mapper.BtLogMapper;
import com.lzctzk.address.pojo.building.mapper.LogMapper;
import com.lzctzk.address.util.IP.IpUtil;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultMessage;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class LogService {

    private static final Logger log = LoggerFactory.getLogger(BuildingService.class);

    @Autowired
    private LogMapper logMapper;

    @Autowired
    private BtLogMapper btLogMapper;

    /**
     * 统计日志
     *
     * @return
     */
    public Result getTolCount(String clown, String strWhere) {
        try {
            if (EmptyUtil.isEmpty(clown)) {
                clown = "ID";
            }
            if (EmptyUtil.isEmpty(strWhere)) {
                strWhere = " 1=1";
            }
            List<HashMap> map = new ArrayList<>();
            map = logMapper.selectTolCount(clown);

            return ResultMessage.success(map, map.size());
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultMessage.custom(-99, e.getMessage(), null, Long.valueOf(0));
        }
    }

    /**
     * 动态查询
     *
     * @param btLog
     * @param page
     * @param limit
     * @return
     */
    public Result getByDynamic(BtLog btLog, Integer page, Integer limit, String likeValue) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        if ((page == null) || (limit == null)) {
            page = 1;
            limit = 10;
        }
        Page<BtLog> pageData = new Page<>(page, limit);
        QueryWrapper<BtLog> queryWrapper = checkField(btLog);
        if (EmptyUtil.isNotEmpty(likeValue)) {
            queryWrapper = LikeAllFeild(likeValue);
        }
        IPage<BtLog> result = btLogMapper.selectPage(pageData, queryWrapper);
        Object data = result.getRecords();
        long count = pageData.getTotal();
        if (count > 0) {
            return ResultMessage.success(data, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    /**
     * 新增
     *
     * @return
     */
    public Result addLog(String msg) {
        return addLog(msg, "信息");
    }

    /**
     * 新增
     *
     * @return
     */
    public Result addLog(String msg, String logType) {
        BtLog log = new BtLog();
        log.setLogIp(IpUtil.getIpAddr());
        Session session = SecurityUtils.getSubject().getSession();
        if (EmptyUtil.isNotEmpty(session.getAttribute("userName"))) {
            String userName = session.getAttribute("userName").toString();
            log.setLoguser(userName);
        } else {
            log.setLoguser("admin");
        }
        log.setLogTime(LocalDateTime.now());
        log.setLogType(logType);
        log.setLogMessage(msg);
        long count = btLogMapper.insert(log);
        if (count > 0) {
            return ResultMessage.success();
        } else {
            return ResultMessage.custom(0, "新增日志失败", null, count);
        }
    }

    /**
     * 功能描述: 用于查询时拼接查询条件
     *
     * @param
     * @return
     * @author luozhen
     * @date 2019/2/28 20:59
     */
    private QueryWrapper<BtLog> checkField(BtLog log) {
        QueryWrapper<BtLog> queryWrapper = new QueryWrapper<>();
        if (EmptyUtil.isNotEmpty(log.getId())) {
            queryWrapper.lambda().eq(BtLog::getId, log.getId());
        }
        if (EmptyUtil.isNotEmpty(log.getLogIp())) {
            queryWrapper.lambda().eq(BtLog::getLogIp, log.getLogIp());
        }
        if (EmptyUtil.isNotEmpty(log.getPlugName())) {
            queryWrapper.lambda().eq(BtLog::getPlugName, log.getPlugName());
        }
        if (EmptyUtil.isNotEmpty(log.getLogType())) {
            queryWrapper.lambda().eq(BtLog::getLogType, log.getLogType());
        }
        return queryWrapper;
    }

    public QueryWrapper LikeAllFeild(String likeValue) {
        String whereClause = " 1=1";
        QueryWrapper<BtLog> queryWrapper = new QueryWrapper<>();

        queryWrapper.lambda().or(i -> i.like(BtLog::getLogIp, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtLog::getLogType, likeValue));
        queryWrapper.lambda().or(i -> i.eq(BtLog::getId, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtLog::getPlugName, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtLog::getLogMessage, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtLog::getLogTime, likeValue));
        queryWrapper.lambda().or(i -> i.like(BtLog::getLoguser, likeValue));

        return queryWrapper;
    }
}
