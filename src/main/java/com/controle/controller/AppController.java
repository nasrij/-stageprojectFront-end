package com.controle.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.controle.entities.User;
import com.controle.metier.ScreenshotMetier;
import com.controle.metier.UserMetier;

@Controller
public class AppController implements ErrorController {

	@RequestMapping(value="/")
	public String home()
	{
		return "index";
	}
	@RequestMapping(value="/Home")
	public String Index()
	{
		return "index";
	}
	
	@RequestMapping(value="/Screenshot")
	public String Screenshot()
	{
		return "screenshot";
	}
	
	@RequestMapping(value="/File")
	public String File()
	{
		return "file";
	}
	
	@RequestMapping(value="/Keylogger")
	public String Keylogger()
	{
		return "keylogger";
	}
	
	@RequestMapping(value="/Processus")
	public String Processus()
	{
		return "processus";
	}
	
	@RequestMapping(value="/Session")
	public String Session()
	{
		return "session";
	}
	
	@RequestMapping(value="/User/Profil")
	public String Profile()
	{
		return "profile";
	}
	
	@RequestMapping(value="/User/Edit")
	public String Edit ()
	{
		return "edit";
	}
	
	
	@RequestMapping(value="/User/Password")
	public String Password ()
	{
		
		return "password";
	}
	
	@RequestMapping(value="/Setting")
	public String Setting ()
	{
		return "setting";
	}
	
	@RequestMapping(value="/passwordForget")
	public String password ()
	{
		return "passwordForget";
	}
	
	@Autowired
	private UserMetier userMetier; 
	private User u = null; 
	@RequestMapping(value="/password")
	public String passwordd (@RequestParam String code)
	{
		 u = userMetier.getUserByCode(code);
		if(u!= null)
		{
			return "password";
		}else{
			return "error";
		}
			
		
	}
	
	@RequestMapping(value="/saveNewPass")
	public String savenewpasswordd (@RequestParam String password)
	{
		u.setPassword(password);
		u.setPassforgetActived(false);
		u.setPassforget("");
		u = userMetier.saveUser(u);
		if(u != null)
		{
			return "redirect:signin";
		}else{
			return "error";
		}
			
		
	}
    private static final String PATH = "/error";

	
	@RequestMapping(value=PATH)
	public String Error ()
	{
		return "error";
	}
	
	
	
	@RequestMapping(value="getLogedUser")
	public Map<String,Object> getLogedUser(HttpServletRequest httpServletRequest)
	{
		HttpSession httpSession = httpServletRequest.getSession();
		SecurityContext securityContext = (SecurityContext) httpSession.getAttribute("SPRING_SECURITY_CONTEXT");
		String username = securityContext.getAuthentication().getName();
		List<String> roles = new ArrayList<>();
		for(GrantedAuthority ga:securityContext.getAuthentication().getAuthorities())
		{
			roles.add(ga.getAuthority());
		}
		Map<String,Object> params = new HashMap();
		params.put("username", username);
		params.put("roles", roles);
		System.out.println(username);
		System.out.println(roles.get(0));
		return params;
		
	}
	
	@Value("${dir.images}")
	private String imageDir;
	
	@Autowired
	ScreenshotMetier screenshotMetier;
	
	@RequestMapping(value="/getPhoto",produces=MediaType.IMAGE_JPEG_VALUE)
	@ResponseBody
	public byte[] getPhoto(@RequestParam String path) throws FileNotFoundException, IOException
	{
		
		FTPClient ftpClient = new FTPClient();
		ftpClient.connect("192.168.1.100");
		ftpClient.login("nasri", "123456789");
         ftpClient.enterLocalPassiveMode();
         ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
         InputStream inputStream = ftpClient.retrieveFileStream("/StageProject/src/main/resources/static/"+path);
		return IOUtils.toByteArray(inputStream);
		
	}
	@Override
	public String getErrorPath() {
		// TODO Auto-generated method stub
		return PATH;
	}
	
	
	
}
