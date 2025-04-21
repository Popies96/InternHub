import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService,Topic  } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit { topics: any[] = [];
  filteredTopics: any[] = [];
  categories: any[] = [];
  popularTags: string[] = [];

  activeCategory: string = '';
  activeCategoryName: string = 'All';
  sortOption: string = 'newest';
  showNewTopicModal = false;
  topic!: Topic;
  selectedTopic: any = null; // Holds the selected topic for display

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  currentUser!: number;
  UserName!: string;
  newTopic = {
    userId: Number,
    title: '',
    category: '',
    content: '',
    tags: '',
      prenom: ''
  };

  constructor(private topicService: TopicService,private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTopics(); // Fetch all topics on initial load


  }
  selectTopic(topicId: number): void {
    this.router.navigate(['/student/topics', topicId]);
  }
  loadCategories() {
    this.categories = [
      { id: 'General_Discussion', name: 'General', icon: 'fas fa-comments'},
      { id: 'Support', name: 'Support', icon: 'fas fa-life-ring' },
      // { id: 'feature', name: 'Feature Requests', icon: 'fas fa-lightbulb', count: 0 }
    ];
  }
  
  loadTopics() {
    this.topicService.getAllTopics().subscribe(data => {
      this.topics = data;
      this.extractTags();
      this.updateCategoryCounts();
      this.applyFilters();
      console.log('Topics fetched successfully:', this.topics);

    });
  }
  
  getTopicById(id: number): void {
    this.topicService.getTopicById(id).subscribe(
      (data) => {
        this.topic = data;
        console.log('Topic fetched successfully:', this.topic);
      },
      (error) => {
        console.error('Error fetching topic:', error);
      }
    );
  }
  filterByCategory(categoryId: string) {
    this.activeCategory = categoryId;
    const selected = this.categories.find(c => c.id === categoryId);
    this.activeCategoryName = selected ? selected.name : 'All';
    this.currentPage = 1;
  
    if (categoryId === 'All') {
      this.loadTopics(); // If All is selected, load all topics again
    } else {
      this.topicService.getTopicsByCategory(categoryId).subscribe(data => {
        this.topics = data;
        this.extractTags();
        this.updateCategoryCounts();
        this.applyFilters();
      });
    }
  }
  extractTags() {
    const allTags = this.topics.flatMap(topic => topic.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    this.popularTags = uniqueTags.slice(0, 10); // show top 10
  }

  updateCategoryCounts() {
    for (let category of this.categories) {
      category.count = this.topics.filter(t => t.category === category.id).length;
    }
  }


  applyFilters() {
    let result = this.topics;

    if (this.activeCategory) {
      result = result.filter(t => t.category === this.activeCategory);
    }

    if (this.sortOption === 'newest') {
      result = result.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    } else if (this.sortOption === 'oldest') {
      result = result.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
    } else if (this.sortOption === 'most-commented') {
      result = result.sort((a, b) => b.comments - a.comments);
    }

    this.totalPages = Math.ceil(result.length / this.pageSize);
    this.filteredTopics = result.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  openNewTopicModal() {
    this.showNewTopicModal = true;
  }

  closeNewTopicModal() {
    this.showNewTopicModal = false;
    this.resetNewTopic();
  }

  resetNewTopic() {

  }

  submitNewTopic() {
    const topicPayload = {
      ...this.newTopic,
      tags: this.newTopic.tags.split(',').map(tag => tag.trim())
    };
    const userId = this.currentUser; // Replace with actual user ID logic
  
    this.topicService.createTopic(userId, topicPayload).subscribe(() => {
      this.closeNewTopicModal();
      this.loadTopics();
    });
  }

  upvoteTopic(topicId: number) {
    // Implement upvote API call here
    console.log(`Upvoted topic ${topicId}`);
  }

  downvoteTopic(topicId: number) {
    // Implement downvote API call here
    console.log(`Downvoted topic ${topicId}`);
  }
  searchKeyword: string = '';

  searchTopics(): void {
    if (!this.searchKeyword.trim()) {
      return; // prevent empty search
    }
  
    this.topicService.searchTopics(this.searchKeyword).subscribe({
      next: (topics) => {
        this.filteredTopics = topics; // display the search results
      },
      error: (err) => {
        console.error('Search failed', err);
      }
    });
  }
}