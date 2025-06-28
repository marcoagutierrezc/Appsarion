package com.Backend.EPI.service;

import com.Backend.EPI.persistence.entity.Category;
import com.Backend.EPI.persistence.crud.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        if (categoryRepository.existsById(id)) {
            categoryDetails.setId(id);
            return categoryRepository.save(categoryDetails);
        }
        return null; // O puedes lanzar una excepción si no existe
    }

    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false; // O puedes lanzar una excepción si no existe
    }
}

