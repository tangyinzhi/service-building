package com.lzctzk.address.pojo.building.controller;

import io.swagger.annotations.Api;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Api(tags = "功能页面控制器")
@Controller
@RequestMapping("/Views")
public class ViewsController {
    private static final Logger log = LoggerFactory.getLogger(LogController.class);

    @GetMapping("/")
    public String index() {

        return "index.html";
    }

    @GetMapping("/buildAttManager.html")
    @RequiresPermissions("Av9mhIin")
    public String buildAttManager() {

        return "Views/BuildAttManager.html";
    }

    @GetMapping("/dataAuth.html")
    @RequiresPermissions("mMkXvBJh")
    public String dataAuth() {

        return "Views/dataAuth.html";
    }

    @GetMapping("/dataManager.html")
    @RequiresPermissions("DIHCTcVC")
    public String dataManager() {
        return "Views/dataManager.html";
    }

    @GetMapping("/Log_List.html")
    @RequiresPermissions("yt2Ug8jM")
    public String Log_List() {
        return "Views/Log_List.html";
    }

    @GetMapping("/permission.html")
    @RequiresPermissions("czdVYGge")
    public String permission() {
        return "Views/permission.html";
    }

    @GetMapping("/permission_add")
    public String permission_add() {
        return "Views/permission_add.html";
    }

    @GetMapping("/permission_edit")
    public String permission_edit() {
        return "Views/permission.html";
    }

    @GetMapping("/role.html")
    @RequiresPermissions("DIHCTcVC")
    public String role() {
        return "Views/role.html";
    }

    @GetMapping("/System.html")
    @RequiresPermissions("p6KIbxgb")
    public String system() {
        return "Views/System.html";
    }

    @GetMapping("/user.html")
    @RequiresPermissions("0QwjjaLg")
    public String user() {
        return "Views/user.html";
    }

    @GetMapping("/userGroupManager.html")
    @RequiresPermissions("ebrzVuax")
    public String userGroupManager() {
        return "Views/userGroupManager.html";
    }

    @GetMapping("/buildname_map.html")
    @RequiresPermissions("N9V8EZ3K")
    public String buildnamemap() {
        return "Views/buildname_map.html";
    }

    @GetMapping("/ColumnsManager.html")
    @RequiresPermissions("s2gRE6cZ")
    public String ColumnsManager() {
        return "Views/ColumnsManager.html";
    }

    @GetMapping("/formManager.html")
    @RequiresPermissions("t9Pp0J9D")
    public String formManager() {
        return "Views/formManager.html";
    }

    @GetMapping("/BuildAttManager.html")
    @RequiresPermissions("Av9mhIin")
    public String BuildAttManager() {
        return "Views/BuildAttManager.html";
    }
}
