package com.lzctzk.address.pojo.building.controller;/**
 * @author luozhen
 * @date 2019/2/13 15:09
 * @version V1.0
 * @description
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lzctzk.address.config.common.AttachConfig;
import com.lzctzk.address.dao.building.entity.OtAttach;
import com.lzctzk.address.dao.building.service.IOtAttachService;
import com.lzctzk.address.pojo.building.mapper.AttachBuildingMapper;
import com.lzctzk.address.pojo.building.servcie.LogService;
import com.lzctzk.address.util.date.CommonMethod;
import com.lzctzk.address.util.date.DateUtil;
import com.lzctzk.address.util.result.Result;
import com.lzctzk.address.util.result.ResultEnum;
import com.lzctzk.address.util.result.ResultMessage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/2/13 15:09
 * @description
 */
@Api(tags = "建筑物属性附件控制器")
@RestController
@RequestMapping({"/building"})
public class AttachBuildingController {

    private static final Logger log = LoggerFactory.getLogger(AttachBuildingController.class);

    @Resource
    private AttachConfig attachConfig;

    ///**
    // * 附件存储地址
    // */
    //private String ATTACH_URL =attachConfig.getUrl();
    //
    //private String ATTACH_FPF_URL = attachConfig.getFpfName();
    ///**
    // * 附件默认状态 未启用
    // */
    //private String ATTACH_STATUS_UNUSED = attachConfig.getUnused();
    //
    ///**
    // * 附件状态 启用
    // */
    //private String ATTACH_STATUS_USED = attachConfig.getUsed();
    //
    ///**
    // * 临时附件存储地址
    // */
    //private String TEMP_ATTACH_URL = attachConfig.getTempUrl();
    //
    ///**
    // * 附件的业务名
    // */
    //private String PROF_NAME = attachConfig.getProfName();

    @Autowired
    private IOtAttachService iOtAttachService;

    @Autowired
    private AttachBuildingMapper attachBuildingMapper;

    @Autowired
    LogService logService;

    @GetMapping(value = "attachConfig")
    public Result getAttachConfig() {
        //log.info(attachConfig.toString());
        //log.info("ATTACH_URL",ATTACH_URL);
        //log.info("ATTACH_FPF_URL",ATTACH_FPF_URL);
        //log.info("ATTACH_STATUS_UNUSED",ATTACH_STATUS_UNUSED);
        //log.info("ATTACH_STATUS_USED",ATTACH_STATUS_USED);
        //log.info("TEMP_ATTACH_URL",TEMP_ATTACH_URL);
        //log.info("PROF_NAME",PROF_NAME);
        return ResultMessage.success(attachConfig);
    }

    @PostMapping(value = "/upload")
    public Result upload(HttpServletRequest request) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        logService.addLog("上传图片");
        int fileCount = 0;
        String profName = attachConfig.getProfName();
        //String relaId = id;
        //log.info("id:"+id);
        //附件id数组
        List attachIds = new ArrayList();
        //解析文件
        if (request instanceof MultipartHttpServletRequest) {
            MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
            // 获取上传的文件域名
            Iterator<String> namesIterator = multipartHttpServletRequest.getFileNames();
            log.info("获取上传的文件域名" + namesIterator.toString());

            //据文件域名迭代
            while (namesIterator.hasNext()) {
                log.info("根据文件域名迭代");
                String name = namesIterator.next();
                List<MultipartFile> multipartFiles = multipartHttpServletRequest.getFiles(name);
                Iterator<MultipartFile> multipartFilesIterator = multipartFiles.iterator();

                //迭代文件对象
                while (multipartFilesIterator.hasNext()) {
                    log.info("根据文件域名迭代文件对象");
                    MultipartFile multipartFile = multipartFilesIterator.next();
                    log.info(multipartFile.getName() + ":" + multipartFile.getOriginalFilename());
                    if (!multipartFile.isEmpty()) {
                        try {
                            String attachId = saveFile(profName, multipartFile);
                            attachIds.add(attachId);
                            fileCount++;
                        } catch (Exception e) {
                            log.error("文件上传出现异常,成功上传" + fileCount + "个文件。");
                            e.printStackTrace();
                            return ResultMessage.custom(ResultEnum.UPLOADERROR);
                        }
                    }
                }
            }
        }
        log.info("上传文件总数：" + fileCount);
        log.info("上传成功返回的附件数组：" + attachIds.toString());
        //交易成功
        return ResultMessage.custom(ResultEnum.UPLOADSUCCESS, attachIds, fileCount);
    }


    /**
     * @param profName 附件业务名称
     * @return int     附件id号
     * @throws
     * @title saveFile
     * @description 存储文件记录数据库
     */
    private String saveFile(String profName, MultipartFile multipartFile) throws Exception {
        //文件参数整理
        //原始文件名
        String myFileName = multipartFile.getOriginalFilename();
        //文件大小
        String fileSize = multipartFile.getSize() + "";
        //文件名
        String fileNme = myFileName.substring(0, myFileName.lastIndexOf("."));
        //获取文件的后缀名
        String fileType = myFileName.substring(myFileName.lastIndexOf(".") + 1);
        //存储文件名（加上时间是为了保证文件的唯一名称）
        String saveName = fileNme + "-" + DateUtil.getStringAllDate();
        //存储文件全名称（压缩图片文件名）
        String saveFullName = saveName + "." + fileType;
        //String saveFullNameRes = saveName + "_res" + fileType;//存储文件全名称（未压缩文件）（只有需进行压缩的文件才保存原文件）

        //创建存储文件夹
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        String date = sdf.format(new Date());
        //存储文件夹路径
        String fileFolder = attachConfig.getUrl() + date;
        //相对存储路径
        String fileFpfName = attachConfig.getFpfName() + date + "/" + saveFullName;
        File folder = new File(fileFolder);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        //创建文件
        String filePath = "";
        /*if (".png,.jpg,.jpeg,.gif,.bmp".indexOf(fileType) >= 0) {//图片文件需要压缩需要保存原文件
            filePath = fileFolder + "/" + saveFullNameRes;
        } else {
            filePath = fileFolder + "/" + saveFullName;
        }*/
        filePath = fileFolder + "/" + saveFullName;

        File diskFile = new File(filePath);

        //写入文件
        multipartFile.transferTo(diskFile);

        //创建文件 不用检查文件是否存在，UUID能保证文件名的不重复性
        diskFile.createNewFile();

        //插入数据库
        OtAttach attach = new OtAttach();
        //attach.setAttachId(uuidUtils.getUUID32());
        //attach.setAttachRelaId(relaId);
        attach.setOaProfName(profName);
        //设置文件存储路径
        attach.setOaFpfName(fileFpfName);
        //设置文件存储名字
        attach.setOaSaveName(saveName);
        //设置文件存储路径
        attach.setOaPath(fileFolder);
        //设置文件类型
        attach.setOaType(fileType);
        //设置文件大小
        attach.setOaSize(fileSize);
        //附件状态默认为未启用
        attach.setOaStatus(attachConfig.getUnused());
        attach.setOaUploadTime(LocalDateTime.now());
        attach.setOaIsDelete(0);

        //保存附件
        iOtAttachService.save(attach);

        //异步压缩文件
        //compressFile(fileFolder, saveName, fileType, fileSize);

        return attach.getOaId();
    }

    @ApiOperation(value = "查询附件", response = Result.class)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "obId", value = "建筑物的id", required = true)
    })
    @PostMapping(value = "/select/{obId}")
    public Result selectByParkingId(@PathVariable("obId") String obId) {
        log.info("进入==>控制器：" + this.getClass().getName() + "==>接口方法：" + Thread.currentThread().getStackTrace()[1].getMethodName());
        log.info("传入的数据：" + obId);
        logService.addLog("查询附件");
        List<Object> result = new ArrayList<>();
        List<OtAttach> result1 = attachBuildingMapper.selectInnerById(obId);
        List<OtAttach> result2 = attachBuildingMapper.selectInnerByIdEdit(obId);
        result.addAll(result1);
        result.addAll(result2);
        return ResultMessage.success(result, result.size());
    }

    @ApiOperation(value = "查询附件", notes = "通过图片附件的id拼接字符串查询")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "ids", value = "图片附件的id字符串，用逗号拼接", required = true)
    })
    @PostMapping(value = "/selectStr")
    public Result selectByIds(String ids) {
        List<String> idList = CommonMethod.divisionToList(ids, ",");
        log.info("输出格式1：{}", idList.toString());
        QueryWrapper<OtAttach> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().in(OtAttach::getOaId, idList);
        List<OtAttach> result = iOtAttachService.list(queryWrapper);
        long count = result.size();
        return ResultMessage.success(result, count);
    }

}