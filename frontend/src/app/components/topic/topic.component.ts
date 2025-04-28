
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicReactionService } from 'src/app/services/topic-reaction.service';
import { TopicService, Topic } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
})
export class TopicComponent implements OnInit {
  topics: Topic[] = [];
  filteredTopics: Topic[] = [];
  categories: any[] = [];
  popularTags: string[] = [];
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  showNewTopicModal = false;
  showUpdateTopicModal = false;
  reactions: {
    [key: number]: {
      likes: number;
      dislikes: number;
      userReaction: 'like' | 'dislike' | 'None' | null;
    };
  } = {};
  topicToUpdate: Topic = {
    id: 0,
    title: '',
    content: '',
    category: '',
    tags: [],
    userId: 0,
    prenom: '',
    dateCreated: new Date(),
    imagePath: '',
    views: 0,
  };
  activeCategory: string = '';
  activeCategoryName: string = 'All';
  sortOption: string = 'newest';
  searchKeyword: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  currentUser: number | null = null;
  error: string | null = null;

  newTopic = {
    title: '',
    category: '',
    content: '',
    tags: '',
    prenom: '',
  };

  constructor(
    private topicService: TopicService,
    private userService: UserService,
    private router: Router,
    private topicReactionService: TopicReactionService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTopics();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.userService.getUserFromLocalStorage().subscribe({
      next: (user) => {
        this.currentUser = user.id;
        this.newTopic.prenom = user.nom || '';
      },
      error: (err) => {
        console.error('Error loading user:', err);
      },
    });
  }

  loadCategories(): void {
    this.categories = [
      { id: 'General_Discussion', name: 'General', icon: 'fas fa-comments' },
      { id: 'Support', name: 'Support', icon: 'fas fa-life-ring' },
    ];
  }

  loadTopics(): void {
    this.topicService.getAllTopics().subscribe({
      next: (data) => {
        this.topics = data;
        this.extractTags();
        this.updateCategoryCounts();
        this.applyFilters();
        data.forEach((topic) => {
          if (topic.id) {
            this.loadReactions(topic.id);
          }
        });
      },
      error: (err) => {
        console.error('Error loading topics:', err);
        this.error = 'Failed to load topics';
      },
    });
  }

  loadReactions(topicId: number): void {
    if (!topicId) return;

    this.topicReactionService.countLikes(topicId).subscribe((count) => {
      if (!this.reactions[topicId])
        this.reactions[topicId] = { likes: 0, dislikes: 0, userReaction: null };
      this.reactions[topicId].likes = count;
    });

    this.topicReactionService.countDislikes(topicId).subscribe((count) => {
      if (!this.reactions[topicId])
        this.reactions[topicId] = { likes: 0, dislikes: 0, userReaction: null };
      this.reactions[topicId].dislikes = count;
    });

    if (this.currentUser) {
      this.topicReactionService
        .getUserReaction(topicId, this.currentUser)
        .subscribe((reaction) => {
          if (!this.reactions[topicId])
            this.reactions[topicId] = {
              likes: 0,
              dislikes: 0,
              userReaction: null,
            };
          this.reactions[topicId].userReaction =
            reaction === 'LIKE'
              ? 'like'
              : reaction === 'DISLIKE'
              ? 'dislike'
              : reaction === 'NONE'
              ? 'None'
              : null;
        });
    }
  }

  extractTags(): void {
    const allTags = this.topics.flatMap((topic) => topic.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    this.popularTags = uniqueTags.slice(0, 10);
  }

  updateCategoryCounts(): void {
    for (let category of this.categories) {
      category.count = this.topics.filter(
        (t) => t.category === category.id
      ).length;
    }
  }

  applyFilters(): void {
    let result = [...this.topics];

    if (this.activeCategory) {
      result = result.filter((t) => t.category === this.activeCategory);
    }

    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          t.content.toLowerCase().includes(keyword) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(keyword)))
      );
    }

    this.totalPages = Math.ceil(result.length / this.pageSize);
    this.filteredTopics = result.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  selectTopic(topicId: number): void {
    this.router.navigate(['/student/topics', topicId]);
  }

  react(reactionType: 'like' | 'dislike', topicId: number): void {
    if (!topicId || this.currentUser === null) return;

    this.topicReactionService
      .reactToTopic(topicId, this.currentUser, reactionType)
      .subscribe({
        next: () => this.loadReactions(topicId),
        error: (err) => {
          console.error('Reaction error:', err);
          this.error = 'Failed to record your reaction';
        },
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  filterByCategory(categoryId: string): void {
    this.activeCategory = categoryId === 'All' ? '' : categoryId;
    const selected = this.categories.find((c) => c.id === categoryId);
    this.activeCategoryName = selected ? selected.name : 'All';
    this.currentPage = 1;
    this.applyFilters();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  openNewTopicModal(): void {
    this.showNewTopicModal = true;
  }

  closeNewTopicModal(): void {
    this.showNewTopicModal = false;
    this.resetNewTopicForm();
  }

  submitTopic(): void {
    if (!this.currentUser) return;

    const topicPayload = {
      title: this.newTopic.title,
      content: this.newTopic.content,
      category: this.newTopic.category,
      tags: this.newTopic.tags.split(',').map((tag) => tag.trim()),
      userId: this.currentUser,
      prenom: this.newTopic.prenom,
    };

    this.topicService
      .createTopic(
        this.currentUser,
        topicPayload,
        this.selectedFile || undefined
      )
      .subscribe({
        next: () => {
          this.closeNewTopicModal();
          this.loadTopics();
        },
        error: (err) => {
          console.error('Error creating topic:', err);
          this.error = 'Failed to create topic';
        },
      });
  }

  resetNewTopicForm(): void {
    this.newTopic = {
      title: '',
      category: '',
      content: '',
      tags: '',
      prenom: this.newTopic.prenom,
    };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  searchTopics(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  openUpdateTopicModal(topic: Topic): void {
    this.topicToUpdate = { ...topic };
    this.showUpdateTopicModal = true;
  }

  closeUpdateTopicModal(): void {
    this.showUpdateTopicModal = false;
    this.resetUpdateForm();
  }

  submitUpdatedTopic(): void {
    if (!this.currentUser || !this.topicToUpdate.id) return;

    const topicPayload = {
      ...this.topicToUpdate,
      tags: Array.isArray(this.topicToUpdate.tags)
        ? this.topicToUpdate.tags
        : String(this.topicToUpdate.tags)
            .split(',')
            .map((tag) => tag.trim()),
    };

    this.topicService
      .updateTopic(
        this.topicToUpdate.id,
        this.currentUser,
        topicPayload,
        this.selectedFile || undefined
      )
      .subscribe({
        next: () => {
          this.closeUpdateTopicModal();
          this.loadTopics();
        },
        error: (err) => {
          console.error('Error updating topic:', err);
          this.error = 'Failed to update topic';
        },
      });
  }

  resetUpdateForm(): void {
    this.topicToUpdate = {
      id: 0,
      title: '',
      content: '',
      category: '',
      tags: [],
      userId: this.currentUser || 0,
      prenom: this.newTopic.prenom,
      dateCreated: new Date(),
      imagePath: '',
      views: 0,
    };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  openDeleteModal(topic: Topic): void {
    if (confirm('Are you sure you want to delete this topic?')) {
      if (topic.id !== undefined) {
        this.deleteTopic(topic.id);
      } else {
        console.error('Topic ID is undefined');
      }
    }
  }

  deleteTopic(topicId: number): void {
    if (this.currentUser === null) return;

    this.topicService.deleteTopic(topicId, this.currentUser).subscribe({
      next: () => {
        this.loadTopics();
      },
      error: (err) => {
        console.error('Failed to delete topic:', err);
        this.error = 'Failed to delete topic';
      },
    });
  }

  isCreator(topicUserId: number): boolean {
    return this.currentUser !== null && topicUserId === this.currentUser;
  }
}