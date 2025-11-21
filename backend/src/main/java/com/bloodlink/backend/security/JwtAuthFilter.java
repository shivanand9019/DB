//package com.bloodlink.backend.security;
//
//import com.bloodlink.backend.model.User;
//import com.bloodlink.backend.repositories.UserRepo;
//import com.bloodlink.backend.service.UserService;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.WebAuthenticationDetails;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.List;
//
//@Component
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//    private final JwtService jwtService;
//    private final UserRepo userRepo;
//
//    public JwtAuthFilter(JwtService jwtService, UserRepo userRepo) {
//        this.jwtService = jwtService;
//        this.userRepo = userRepo;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        final String authHeader = request.getHeader("Authorization");
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//        }
//        final String jwt = authHeader.substring(7);
//        final String email = jwtService.extractEmail(jwt);
//
//        if(email!=null&& SecurityContextHolder.getContext().getAuthentication()==null){
//            User user  = userRepo.findByEmail(email).orElse(null);
//
//            if(user!=null){
//                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user,null, List.of());
//                authToken.setDetails(new WebAuthenticationDetails(request));
//                SecurityContextHolder.getContext().setAuthentication(authToken);
//
//            }
//        }
//        filterChain.doFilter(request, response);
//    }
//}
