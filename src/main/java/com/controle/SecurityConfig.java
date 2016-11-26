package com.controle;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.web.mgt.WebSecurityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled=true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	public void globalConfig(AuthenticationManagerBuilder auth,DataSource dataSource)throws Exception{
		//auth.inMemoryAuthentication().withUser("admin").password("123").roles("ADMIN","USER");
		//auth.inMemoryAuthentication().withUser("nasri").password("123").roles("USER");
		auth.jdbcAuthentication().dataSource(dataSource)
		.passwordEncoder(passwordEncoder())
		.usersByUsernameQuery("select username as principal, password as credentials, true from users where username = ? ")
		.authoritiesByUsernameQuery("select u.username as principal, r.role_id as role from users_roles r , users u where u.username = ? and r.user_id = u.machine_name")
		
		.rolePrefix("ROLE_");
		
	}
	
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		.csrf().disable()
		.authorizeRequests()
		.antMatchers("http://localhost:8082/static/js/**","http://localhost:8082/static/css/**","http://localhost:8082/static/fonts/**","/passwordForget","/user/mail","http://localhost:8080/user/mail","/password","/saveNewPass").permitAll()
		.anyRequest()
		.authenticated()
		.and()
		.formLogin()
		.loginPage("/signin").permitAll()
		.defaultSuccessUrl("/Home");
	}
	
    private final Log log = LogFactory.getLog(SecurityConfig.class);

	
	@Bean
    public PasswordEncoder passwordEncoder() {
      log.info("Creating password encoder bean");
      return new BCryptPasswordEncoder();
    }

}
