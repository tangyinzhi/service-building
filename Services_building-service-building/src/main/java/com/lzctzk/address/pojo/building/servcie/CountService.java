package com.lzctzk.address.pojo.building.servcie;

import com.lzctzk.address.pojo.building.mapper.CountMapper;
import com.lzctzk.address.util.empty.EmptyUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * com.lzctzk.address.pojo.building.servcie
 *
 * @author luozhen
 * @version V1.0
 * @date 2019-3-20 11:15
 * @description
 */
@Service
public class CountService {

    private static final Logger log = LoggerFactory.getLogger(CountService.class);

    @Autowired
    private CountMapper countMapper;

    public Result getCount(String columnName) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        if (columnName.equals("OB_COMP_DATE")) {
            columnName = "TO_CHAR(OB_COMP_DATE,'YYYY')";

        }
        List<Map> editData = countMapper.getCount(columnName, "BUILD_ATT");
        List<Map> addData = countMapper.getCount(columnName, "OT_BUILDING");
        List<Map> result = new ArrayList<>();
        result.addAll(editData);

        for (int i = 0; i < result.size(); i++) {
            Map m1 = result.get(i);
            if (m1.get("COLUMNNAME") == null) {
                m1.put("COLUMNNAME", "其他");
            }
            for (int j = 0; j < addData.size(); j++) {
                Map m2 = addData.get(j);
                if (m2.get("COLUMNNAME") == null) {
                    m2.put("COLUMNNAME", "其他");
                }
                if (m1.get("COLUMNNAME").equals(m2.get("COLUMNNAME"))) {
                    String s1 = m1.get("COUNTNUM").toString();
                    String s2 = m2.get("COUNTNUM").toString();
                    Integer num = Integer.parseInt(s1) + Integer.parseInt(s2);
                    m1.put("COUNTNUM", num);
                    addData.remove(m2);
                    break;
                }
            }
        }
        result.addAll(addData);
        long count = result.size();
        if (count > 0) {
            return ResultMessage.success(result, count);
        } else {
            return ResultMessage.custom(0, "查询数据为空", null, count);
        }
    }

    public Result getCountWithDate(String columnName, String dateValue) {
        log.info("进入==>服务：" + this.getClass().getName() + "==>服务方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        Map<String, Object> map = new HashMap<>();
        map.put("COLUMNNAME", dateValue + "年以上");
        if (EmptyUtil.isNotEmpty(dateValue)) {
            int editData = countMapper.getCountByDate(dateValue, "BUILD_ATT");
            int addData = countMapper.getCountByDate(dateValue, "OT_BUILDING");
            int number = editData + addData;
            map.put("COUNTNUM", number);
        } else {
            map.put("COUNTNUM", 0);
        }
        List<Map> result = new ArrayList<Map>();
        result.add(map);
        return ResultMessage.success(result, 1);
    }
}
