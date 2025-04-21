import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  categories = [
    { id: 1, name: 'General Discussion', icon: 'fas fa-comments', count: 124 },
    { id: 2, name: 'Technical Support', icon: 'fas fa-wrench', count: 89 },
    { id: 3, name: 'Suggestions', icon: 'fas fa-lightbulb', count: 42 },
    { id: 4, name: 'Announcements', icon: 'fas fa-bullhorn', count: 15 },
    { id: 5, name: 'Introductions', icon: 'fas fa-handshake', count: 37 }
  ];

  popularTags = ['angular', 'typescript', 'javascript', 'css', 'html5', 'webdev', 'beginners'];

  topics = [
    {
      id: 1,
      title: 'How to implement lazy loading in Angular?',
      author: 'devUser123',
      category: 'Technical Support',
      date: new Date('2023-05-15'),
      votes: 24,
      comments: 8,
      views: 156,
      tags: ['angular', 'performance'],
      content: 'Detailed content would go here...'
    },
    // Add more topics...
  ];

  filteredTopics = [...this.topics];
  activeCategory = 1;
  activeCategoryName = 'General Discussion';
  sortOption = 'newest';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = Math.ceil(this.topics.length / this.itemsPerPage);
  
  showNewTopicModal = false;
  newTopic = {
    title: '',
    category: 1,
    content: '',
    tags: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.sortTopics();
  }

  filterByCategory(categoryId: number): void {
    this.activeCategory = categoryId;
    const category = this.categories.find(c => c.id === categoryId);
    this.activeCategoryName = category ? category.name : 'All Discussions';
    
    if (categoryId === 0) {
      this.filteredTopics = [...this.topics];
    } else {
      this.filteredTopics = this.topics.filter(topic => 
        this.categories.find(c => c.id === categoryId)?.name === topic.category
      );
    }
    this.sortTopics();
    this.currentPage = 1;
  }

  sortTopics(): void {
    switch (this.sortOption) {
      case 'newest':
        this.filteredTopics.sort((a, b) => b.date.getTime() - a.date.getTime());
        break;
      case 'oldest':
        this.filteredTopics.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'most-commented':
        this.filteredTopics.sort((a, b) => b.comments - a.comments);
        break;
    }
  }

  upvoteTopic(topicId: number): void {
    const topic = this.topics.find(t => t.id === topicId);
    if (topic) topic.votes++;
  }

  downvoteTopic(topicId: number): void {
    const topic = this.topics.find(t => t.id === topicId);
    if (topic) topic.votes--;
  }

  openNewTopicModal(): void {
    this.showNewTopicModal = true;
  }

  closeNewTopicModal(): void {
    this.showNewTopicModal = false;
    this.newTopic = {
      title: '',
      category: 1,
      content: '',
      tags: ''
    };
  }

  submitNewTopic(): void {
    const newTopic = {
      id: this.topics.length + 1,
      title: this.newTopic.title,
      author: 'currentUser', // Replace with actual user
      category: this.categories.find(c => c.id === this.newTopic.category)?.name || 'General Discussion',
      date: new Date(),
      votes: 0,
      comments: 0,
      views: 0,
      tags: this.newTopic.tags.split(',').map(tag => tag.trim()),
      content: this.newTopic.content
    };
    
    this.topics.unshift(newTopic);
    this.filterByCategory(this.activeCategory);
    this.closeNewTopicModal();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}